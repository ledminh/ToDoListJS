const container = document.querySelector("main");
const addListButton = document.querySelector('aside .add');
const exportButton = document.querySelector('aside .export');

const engine = Engine(container, addListButton, exportButton);

engine.run();


/**************************************
 * DIALOG
 */
function createDialog() {
    let container = null, input = null, addButton = null, cancelButton = null;
    let addHandle = () => {};

    const setAddHandle = (handle) => addHandle = handle;
    const clearAddHandle = () => addHandle = () => {};

    function createContainer() {
        const elem =  document.createElement('section');
        elem.classList.add("dialog");

        
        return elem;
    }

    function createContentDiv() {
        const content = document.createElement("div");
        content.classList.add('content');

        return content;
    }


    function createInput() {
        const elem = document.createElement("input");
        
        elem.type = "text";
        elem.name = "list-name";
        elem.id = "list-name";

        return elem;

    }


    function createButton(className, text){
        const button = document.createElement("button");

        button.classList.add(className);
        button.innerText = text;

        return button;
    }

    function setUpElements() {
        container = createContainer();
        const contentDiv = createContentDiv();
        container.appendChild(contentDiv);

        input = createInput();
        input.addEventListener('keyup', ({key}) => (key == 'Enter')? inputEnterDetectedHandle(): false);
        
        const panel = document.createElement('div');
        panel.classList.add('panel');

        addButton = createButton("add", "ADD");
        cancelButton = createButton("cancel", "CANCEL");

        panel.appendChild(addButton);
        panel.appendChild(cancelButton);

        contentDiv.appendChild(input);
        contentDiv.appendChild(panel);
    }

    function close() {
        input.placeholder = "";
        container.style.display = "none";
    }

    function add() {
        addHandle(input.value);

        input.value = "";

        

        close();

    }

    const addButtonOnClick = add;

    const inputEnterDetectedHandle = add;

    function cancelButtonOnClick() {
        input.value = "";
        close();

    }
    
    /**********************
     * Public functions
     */
    
    function open(inputPlaceholder) {
        input.placeholder = inputPlaceholder;
        container.style.display = "flex";

        input.focus(); 
    
    }

    const getElement = () => container;



    /**********************
     * Init
     */
    function init() {
        setUpElements();

        addButton.addEventListener('click', addButtonOnClick);
        cancelButton.addEventListener('click', cancelButtonOnClick);

    }




    /****************************************/


    init();

    return {open, getElement, setAddHandle, clearAddHandle}
}

/**************************************
 * TASK
 */
function createTask(taskName, taskContainer, finishDeleteTaskHandle) {
    let container = null, deleteTaskButton = null;
    





    /**********************************
     * Private functions
     */
    function deleteTaskOnClick() {
        taskContainer.removeChild(container);

        finishDeleteTaskHandle(taskName);
    }



    function init() {
        container = document.createElement('li');
        container.innerText = taskName;

        deleteTaskButton = document.createElement('button');
        deleteTaskButton.innerText = "DELETE";
        
        deleteTaskButton.addEventListener('click', deleteTaskOnClick);

        container.appendChild(deleteTaskButton);
    }
    
    
    /**********************************
     * Public functions
     */
    const getElement = () => container;


    /**************************************/
    init();

    return {getElement};
}

/**************************************
 * LIST
 */
function createList(listName, Dialog, listContainer, finishDeleteList) {
    let container = null, headerSection=null, deleteListBtn = null, listTitle = null, listDate=null, bodySection = null, ulElem = null, functionPanel = null, addTaskButton = null;

    let tasks = [];

    function createElement(elemName, className, innerText) {
        const elem = document.createElement(elemName);
        
        className? elem.classList.add(className): false;

        elem.innerText = innerText? innerText : "";

        return elem;
    }

    function deleteListBtnOnClick() {
        listContainer.removeChild(container);
        finishDeleteList(listName);
    }

    function setUpElements() {
        container = createElement('article', 'list', null);
        
        //headerSection
        headerSection = createElement("section", "header");
        deleteListBtn = createElement('button', null, 'DELETE');
        listTitle = createElement('h2', null, listName);
        listDate = createElement('h4', null, `Date: ${(new Date()).toLocaleDateString()}`);

        headerSection.appendChild(deleteListBtn);
        deleteListBtn.addEventListener('click', deleteListBtnOnClick);

        headerSection.appendChild(listTitle);
        headerSection.appendChild(listDate);

        container.appendChild(headerSection);

        //bodySection
        bodySection = createElement('section', 'body', null);
        ulElem = document.createElement('ul');

        bodySection.appendChild(ulElem);

        container.appendChild(bodySection);


        //functionPanel
        functionPanel = createElement('section', 'function-panel', null);
        addTaskButton = createElement('button', null, '+');

        functionPanel.appendChild(addTaskButton);

        container.appendChild(functionPanel);
    }

    function finishDeleteTaskHandle(taskName) {
        tasks = tasks.filter((t) => t != taskName);
    }


    function addTask(taskName) {
        if(taskName != ''){
            const newTask = createTask(taskName, ulElem, finishDeleteTaskHandle);
            tasks.push(newTask);
            ulElem.appendChild(newTask.getElement());
        }
        
    }

    function addTaskHaddle() {
        Dialog.clearAddHandle();
        Dialog.setAddHandle(addTask);
        Dialog.open("Enter task here and click ADD ...");
    }

    function init(){
        setUpElements();

        addTaskButton.addEventListener('click', addTaskHaddle);
    }

    /**********************************
     * Public functions
     */
    const getElement = () => container;
    const getName = () => listName;


    /**************************************/
    init();

    return {getElement, getName};
}


/**************************************
 * ENGINE
 */
function Engine(container, addButton, exportButton){
    let Dialog = null;
    let lists = [];
    let Intro = null;




    /******************************************
     * PRIVATE FUNCTIONS
     */
    function addButtonOnClick() {
        Dialog.clearAddHandle();
        Dialog.setAddHandle(addNewList);
        Dialog.open("Enter list name here and click ADD ...");
    }

    function finishDeleteList(listName) {
        lists = lists.filter(l => l.getName() != listName);

        if(lists.length == 0){
            container.appendChild(Intro);
            container.style.border = "none";
        }
    }

    function addNewList(listName) {
        if(listName != ""){
            const newList = createList(listName, Dialog, container, finishDeleteList);
            lists.push(newList);
            
            if(lists.length == 1){
                clearScreen();
            }

            container.appendChild(newList.getElement());

        }
    }

    function clearScreen() {
        if(lists.length == 1) {
            container.removeChild(Intro);
            container.style.border = "4px solid rgb(26, 26, 36)";
        }
    }

    function createIntro(){
        const elem = document.createElement('span');

        elem.classList.add('intro');

        elem.innerText = 'Click "ADD LIST" button below to add a new list';

        return elem;
    }

    /******************************************
     * PUBLIC FUNCTIONS
     */
    function run() {
        Intro = createIntro();
        container.appendChild(Intro);

        Dialog = createDialog();
        container.appendChild(Dialog.getElement());

        addButton.addEventListener('click', addButtonOnClick);
        
    }


    return {run};
}