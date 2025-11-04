//src/index.js
import "./styles.css";
import {isBefore, differenceInCalendarDays } from "date-fns";

const addProject = document.getElementById("new-project");
const projectPopup = document.getElementById("project-popup");
const submitProject = document.getElementById("submit-project");

let index = 0;

showAllProjects();
colorPriority();
displayDescription();
CheckTaskComplete();
run();


addProject.addEventListener("click", ()=>{
    projectPopup.showModal();
});


submitProject.addEventListener("click", (e)=>{
    e.preventDefault();
    
    const projectName = document.getElementById("input-project").value;

    document.getElementById("input-project").value = "";

    projectPopup.close();

    createProject(projectName);
    run();
});


function createProject(projectName){
    const projectList = document.querySelector(".project-list");
    const div = document.createElement("div");
    div.classList.add("project-item");
    div.dataset.index = index;
    index++;
    
    div.textContent = projectName;
    projectList.appendChild(div);

}


function displayDescription(){
    const taskLines = document.querySelectorAll(".task-line");
    const upTriangles = document.querySelectorAll(".fa-play");
    const descriptions = document.querySelectorAll(".full-description");

    descriptions.forEach(description => {
        description.style.display = "none";
    });

    taskLines.forEach((taskLine, index) => {
        taskLine.addEventListener("click" , ()=> {
            const description = descriptions[index];

            const display = getComputedStyle(description).display;
            description.style.display = display === "grid" ? "none": "grid" ;
            
            const upTriangle = upTriangles[index];
            upTriangle.classList.toggle("rotate");
        });
    });

}


function colorPriority(){
    const priorities = document.querySelectorAll(".priority");

    priorities.forEach((priority) =>{
        if (priority.textContent === "HIGH") {
            priority.style.color = "rgb(210, 73, 73)";
            priority.style.background = "rgb(248, 190, 190)";
        } else if(priority.textContent === "MEDIUM") {
            priority.style.color = "rgb(190, 118, 9)";
            priority.style.background = "rgb(232, 217, 130)";
        } else if(priority.textContent === "LOW") {
            priority.style.color = "rgb(16, 156, 56)";
            priority.style.background = "rgb(194, 243, 201)";
        }
    });

}
    

function CheckTaskComplete(){
    const dues = document.querySelectorAll(".due");
    const checkboxes = document.querySelectorAll(".completed");

    checkboxes.forEach((checkbox, index) =>{
        const due = dues[index].textContent;
        checkbox.addEventListener("click", (e)=> {
                e.stopPropagation();

                dues[index].textContent = checkbox.checked? "Completed": due;
        });
    });

}
    
// Add new task

let currentProject;

function run(){
    const projectItems = document.querySelectorAll(".project-item");

    const addTaskButton = document.getElementById("new-task");
    const popup = document.getElementById("popup");
    const closeBtn = document.getElementById("close");

    let inputTask = "";
    let inputDescription = "";
    let inputPriority = "";
    let inputDeadline = "";
    let inputShortDescription = "";

    projectItems.forEach((project) =>{
        project.addEventListener("click", ()=>{
            currentProject = project;
            projectItems.forEach((project) => {
                project.classList.remove("active");
            });
            
            project.classList.add("active");

            showProject(currentProject);
            displayDescription();
            colorPriority();
            CheckTaskComplete();
            deleteTask(currentProject);
        });
    });

    addTaskButton.addEventListener("click", ()=>{
        popup.showModal();
    });

    closeBtn.addEventListener("click", ()=> {
        inputTask = document.getElementById("input-task").value;
        inputDescription = document.getElementById("input-description").value;
        inputPriority = document.getElementById("input-priority").value;
        //console.log(`input priority: ${inputPriority}`);
        inputDeadline = document.getElementById("input-deadline").value;
        //console.log(`input deadline: ${inputDeadline}`);
        inputShortDescription = document.getElementById("short-description").value;

        popup.close();

        if (!inputTask) return;

        createTask(currentProject, inputTask, inputShortDescription, inputPriority, inputDeadline, inputDescription);
        displayDescription();
        colorPriority();
        CheckTaskComplete();
        deleteTask(currentProject);
        //saveProject(currentProject);

        document.getElementById("input-task").value="";
        document.getElementById("input-description").value ="";
        document.getElementById("input-priority").value = "";
        document.getElementById("input-deadline").value = "";
        document.getElementById("short-description").value = "";
    
    });

}


function formatDue(inputDeadline){

    const today = new Date();
    console.log(`Today: ${today}`);
    console.log(inputDeadline);
    /*if (isBefore(inputDeadline, today)){
        return "Task overdue";
    } else {*/
    const daysDifference = differenceInCalendarDays(inputDeadline, today);
    console.log(daysDifference);
    if ( daysDifference <0){
        return "Task overdue" ;
    }else{
        
        if (daysDifference === 0){
            return `Due Today`;
        } else if (daysDifference ===1){
            return `Due Tomorrow`;
        } else {
            return `Due in ${daysDifference} days`;
        }
    }

}


function createTask(project, inputTask, inputShortDescription, inputPriority, inputDeadline, inputDescription){
    const taskBox = document.querySelector(".task-box");

    const taskLine = document.createElement("div");
    taskLine.classList.add("task-line");

    const left = document.createElement("div");
    left.classList.add("left");

    const checkboxTask = document.createElement("input");
    checkboxTask.type = "checkbox";
    checkboxTask.classList.add("completed");

    left.appendChild(checkboxTask);

    const taskDetail = document.createElement("div");
    taskDetail.classList.add("task-detail");
    const taskTitle = document.createElement("h3");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = inputTask;

    const shortDescription = document.createElement('p');
    shortDescription.classList.add("task-short-description");
    shortDescription.textContent = inputShortDescription;

    taskDetail.appendChild(taskTitle);
    taskDetail.appendChild(shortDescription);
    left.appendChild(taskDetail);
    
    const right = document.createElement("div");
    right.classList.add("right");

    const priorityBox = document.createElement("p");
    priorityBox.classList.add("priority");
    priorityBox.textContent = inputPriority;

    const dueBox = document.createElement("p");
    dueBox.classList.add("due");
    dueBox.textContent = formatDue(inputDeadline);

    const triangleIcon = document.createElement("i");
    triangleIcon.classList.add("fa-solid");
    triangleIcon.classList.add("fa-play");

    const DeleteIcon = document.createElement("i");
    DeleteIcon.classList.add("fa-solid");
    DeleteIcon.classList.add("fa-trash");


    right.appendChild(priorityBox);
    right.appendChild(dueBox);
    right.appendChild(triangleIcon);
    right.appendChild(DeleteIcon);

    const fullDescription = document.createElement("div");
    fullDescription.classList.add("full-description");

    const empty = document.createElement("div");
    empty.classList.add("empty");

    fullDescription.appendChild(empty);

    const descriptionBox = document.createElement("div");
    descriptionBox.classList.add("description");

    const h3 = document.createElement("h3");
    h3.textContent = "Full description";
    descriptionBox.appendChild(h3);

    const description = document.createElement("p");
    description.classList.add = "description-text";
    description.textContent = inputDescription;
    descriptionBox.appendChild(description);

    fullDescription.appendChild(descriptionBox);

    taskLine.appendChild(left);
    taskLine.appendChild(right);
    taskLine.appendChild(fullDescription);

    taskBox.appendChild(taskLine);

    saveProject(project);

}


function deleteTask(project){
    const trashIcons = document.querySelectorAll(".fa-trash");

    trashIcons.forEach(trash => {
        trash.addEventListener("click", (e)=> {
            //e.stopPropagation();
            e.target.closest(".task-line").remove();
            
            saveProject(project);
        })
    });

}


function saveProject(project){
    const taskBox = document.querySelector(".task-box");
    //console.log(`Task box: ${taskBox.innerHTML}`);

    const index = project.dataset.index;
    localStorage.setItem(`project-${index}`, taskBox.innerHTML);

    const projectItem = document.querySelector(`.project-item[data-index="${index}"]`);
    localStorage.setItem(`name-${index}`, projectItem.textContent.trim());

}


function showProject(project){
    const taskBox = document.querySelector(".task-box");

    const index = project.dataset.index;
    taskBox.innerHTML = localStorage.getItem(`project-${index}`);

}


function showAllProjects(){

    let n_projects = (localStorage.length - 1)/2;

    for (let i=0; i<n_projects; i++){
        const projectName = localStorage.getItem(`name-${i}`);
        createProject(projectName);

        if (i === 0) {
            //const firstProject = localStorage.getItem(`project-${i}`);
            const projectItem = document.querySelector(`.project-item[data-index="${i}"]`);

            showProject(projectItem);
            colorPriority();
            deleteTask(projectItem);
        }
    }
}
