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

    function addButtonOnClick() {
        addHandle(input.value);

        input.value = "";

        close();
    }

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
function createTask(taskName) {
    let container = null, deleteTaskButton = null;
    
    function init() {
        container = document.createElement('li');
        container.innerText = taskName;

        deleteTaskButton = document.createElement('button');
        deleteTaskButton.innerText = "DELETE";
        
        //TODO: deleteTaskButton.addEventListener('click', deleteTask);

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
function createList(listName, Dialog) {
    let container = null, headerSection=null, deleteListBtn = null, listTitle = null, listDate=null, bodySection = null, ulElem = null, functionPanel = null, addTaskButton = null;

    const tasks = [];

    function createElement(elemName, className, innerText) {
        const elem = document.createElement(elemName);
        
        className? elem.classList.add(className): false;

        elem.innerText = innerText? innerText : "";

        return elem;
    }

    function setUpElements() {
        container = createElement('article', 'list', null);
        
        //headerSection
        headerSection = createElement("section", "header");
        deleteListBtn = createElement('button', null, 'DELETE');
        listTitle = createElement('h2', null, listName);
        listDate = createElement('h4', null, `Date: ${(new Date()).toLocaleDateString()}`);

        headerSection.appendChild(deleteListBtn);
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

    function addTask(taskName) {
        if(taskName != ''){
            const newTask = createTask(taskName);
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


    /**************************************/
    init();

    return {getElement};
}


/**************************************
 * ENGINE
 */
function Engine(container, addButton, exportButton){
    let Dialog = null;
    const lists = [];




    /******************************************
     * PRIVATE FUNCTIONS
     */
    function addButtonOnClick() {
        Dialog.clearAddHandle();
        Dialog.setAddHandle(addNewList);
        Dialog.open("Enter list name here and click ADD ...");
    }

    function addNewList(listName) {
        if(listName != ""){
            const newList = createList(listName, Dialog);
            lists.push(newList);
            container.appendChild(newList.getElement());
        }
    }

    /******************************************
     * PUBLIC FUNCTIONS
     */
    function run() {
        Dialog = createDialog();
        container.appendChild(Dialog.getElement());

        addButton.addEventListener('click', addButtonOnClick);
    }


    return {run};
}