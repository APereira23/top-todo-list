import './style.css';

const appLogic = (() => {
  
  const projectIndex = [];
  const getProjectIndex = () => projectIndex;
  

  const addProject = (name) => {
    function Project(name) {
      this.name = name;
      this.contents = [];
    };
    return new Project(name);  
  };

  const addToDoItem = (name, description, deadline, priority, checklist) => {
    function ToDoItem(name, description, deadline, priority, checklist) {
      this.name = name;
      this.description = description;
      this.deadline = deadline;
      this.priority = priority;
      this.checklist = checklist;
    }
    return new ToDoItem(name, description, deadline, priority, checklist);
  };

  return {
    getProjectIndex,
    addProject,
    addToDoItem,
    };
})();


function input() {
  const projIndex = appLogic.getProjectIndex();

  projIndex.push(appLogic.addProject("Misc"));
  projIndex.push(appLogic.addProject("Work"));
  projIndex.push(appLogic.addProject("Javascript")); 
  
  projIndex[0].contents.push(appLogic.addToDoItem(
    'laundry',
    'Do the Laundry',
    '09/02/2023', 
    'high',
    false
    ));
  
  projIndex[1].contents.push(appLogic.addToDoItem(
    'report-validation',
    'Validate team reports', 
    '14/03/2023', 
    'normal', 
    false
  ));

  projIndex[1].contents.push(appLogic.addToDoItem(
    'team meeting',
    'meet with the team', 
    '23/03/2023', 
    'low', 
    false
  ));
  return projIndex;
};

const projData = input();

const DOMTasks = (() => {

  const getAppContainer = () => {
    const appContainer = document.createElement('div');
    appContainer.setAttribute('id', 'app-container');
    document.body.appendChild(appContainer);
    
    const appHeader = document.createElement('div');
    appHeader.setAttribute('id', 'app-header');
    appHeader.textContent = "Project Index";
    appContainer.appendChild(appHeader);
    
    const projectsContainer = document.createElement('div');
    projectsContainer.setAttribute('id','projects-container');
    appContainer.appendChild(projectsContainer);

    const editBtnContainer = document.createElement('div');
    editBtnContainer.setAttribute('id', 'edit-btn-container');
    appContainer.appendChild(editBtnContainer);
  };

  const showProjects = () => {
    while (document.getElementById('projects-container').firstChild) {
      document.getElementById('projects-container').removeChild(document.getElementById('projects-container').firstChild);
    }
    for (let i = 0; i < projData.length; i++) {
      const folder = document.createElement('div');
      folder.classList.add('row', 'project-folder');
      folder.name = projData[i].name;
      folder.id = `proj-${projData[i].name}`;
      folder.style.display = "block";
      document.getElementById('projects-container').appendChild(folder);
      const foldHeader = document.createElement('div');
      foldHeader.classList.add('folder-header');
      folder.appendChild(foldHeader);
      const foldContent = document.createElement('div');
      foldContent.classList.add('folder-content');
      folder.appendChild(foldContent);

      for (let j = 0; j < projData[i].contents.length; j++) {
        const item = document.createElement('div');
        item.classList.add('row', 'project-item',);
        item.name = projData[i].contents[j].name;
        item.id = `item-${projData[i].contents[j].name}`;
        const itemHeader = document.createElement('div');
        itemHeader.classList.add('folder-header', 'item-header');
        item.appendChild(itemHeader);
        const itemContent = document.createElement('div');
        itemContent.classList.add('folder-content');
        item.appendChild(itemContent);
        foldContent.appendChild(item);

        for (const property in projData[i].contents[j]) {
          if (property === "name" || property === "checklist") continue;  
          const row = document.createElement('div');
          row.classList.add('row', 'project-item-property', property); 
          row.textContent = `${getInitialCase(property)}: ${projData[i].contents[j][property]}`;
          itemContent.appendChild(row); 
        }
      }
    }
  };

  const openCloseFolder = () => {

    
    const headers = Array.from(document.getElementsByClassName('folder-header'));
    for (let i = 0; i < headers.length; i++) {
      const btn = document.createElement('button');
      btn.classList.add('open-close-button');
      btn.textContent = headers[i].parentElement.name; 
      headers[i].appendChild(btn);
    }

    document.querySelectorAll('.project-item, .project-item-property').forEach(div => {
      div.style.display = "none"; 
    });

    Array.from(document.getElementsByClassName('open-close-button'))
                      .forEach(el => el.addEventListener('click', () => {
      Array.from(el.parentElement.parentElement.children[1].children).forEach(child => {
        if (child.style.display === "none") {
          child.style.display = "block";
        } else {
          child.style.display = "none";
        }
      });
                      
    }));
  };

  const getChecklists = () => {
    Array.from(document.getElementsByClassName('item-header')).forEach(el => {
      const checklist = document.createElement('button');
      checklist.classList.add('checklist');
      checklist.innerHTML = "&#10003";
      checklist.style.color = "transparent";  
      el.appendChild(checklist);
    });
    document.querySelectorAll('.checklist').forEach(el => el.addEventListener('click', () => {
      if (el.style.color === "transparent") { 
        el.style.color = "black"; 
      } else {
        el.style.color = "transparent";   
      };
    }));
  };

  const getAddFolderButton = () => {
    const addBtn = document.createElement('button');
    addBtn.classList.add('edit-btn', 'add-btn');
    document.getElementById('app-header').appendChild(addBtn);
    addBtn.textContent = "New List";
    addBtn.addEventListener('click', () => {
      DOMTasks.getFormNewFolder();
    });
  };

  const getFormNewFolder = () => {
    const folders = Array.from(document.getElementsByClassName('project-folder'));
    folders.forEach(folder => {
      folder.style.display = "none";
    });

    const formContainer = document.createElement('div');
    formContainer.setAttribute('id','new-folder-form-container');
    document.getElementById('app-container').appendChild(formContainer);
    const newForm = document.createElement('form');
    newForm.setAttribute('name','form');
    newForm.setAttribute('method','GET');
    formContainer.appendChild(newForm);
    const formTitle = document.createElement('p');
    formTitle.textContent = "Create a new Project";
    newForm.appendChild(formTitle);
    const nameLabel = document.createElement('label');
    nameLabel.classList.add('form-label');
    nameLabel.textContent = "Project name:"; 
    const nameInput = document.createElement('input');
    nameInput.classList.add('form-input');
    nameInput.setAttribute('id','name');
    nameInput.setAttribute('name','new-project-name');
    nameInput.setAttribute('type','text');
    nameInput.setAttribute('value','');  
    newForm.appendChild(nameLabel);
    newForm.appendChild(nameInput);
    const submit = document.createElement('input');
    submit.setAttribute('id','submit');
    submit.setAttribute('type','submit');
    submit.setAttribute('value','Confirm');
    newForm.appendChild(submit);

    const form = document.forms['form'];
    form.onsubmit = function (e) {
      e.preventDefault();
      appLogic.getProjectIndex().push(appLogic.addProject(document.form.name.value));
      formContainer.remove(); 
      DOMTasks.showProjects();  
    };
  };

  const getDeleteFolderButton = () => {
    const dltBtn = document.createElement('button');
    dltBtn.classList.add('edit-btn', 'dlt-btn');
    document.getElementById('app-header').appendChild(dltBtn);
    dltBtn.textContent = "Delete List";
    dltBtn.addEventListener('click', () => {
      appLogic.dltList();
    });
  };

  const getFormNewItem = () => {
     
    const formContainer = document.createElement('div');
    formContainer.setAttribute('id','new-folder-form-container');
    document.getElementById('app-container').appendChild(formContainer);
    const form = document.createElement('form');
    form.setAttribute('name','form');
    form.setAttribute('method','GET');
    formContainer.appendChild(form);
    const formTitle = document.createElement('p');
    formTitle.textContent = "Create a new Project";
    form.appendChild(formTitle);
    const nameLabel = document.createElement('label');
    nameLabel.classList.add('form-label');
    nameLabel.textContent = "Project name:"; 
    const nameInput = document.createElement('input');
    nameInput.classList.add('form-input');
    nameInput.setAttribute('id','new-project-name');
    nameInput.setAttribute('name','new-project-name');
    nameInput.setAttribute('type','text');
    form.appendChild(nameLabel);
    form.appendChild(nameInput);

    const descriptionLabel = document.createElement('label');
    descriptionLabel.classList.add('form-label');
    const descriptionInput = document.createElement('input');
    descriptionInput.classList.add('form-input');
    descriptionInput.setAttribute('id','new-project-description');
    descriptionInput.setAttribute('name','new-project-description');
    descriptionInput.setAttribute('type','text');
    form.appendChild(descriptionLabel);
    form.appendChild(descriptionInput);
    
    const dateLabel = document.createElement('label');
    dateLabel.classList.add('form-label');
    const dateInput = document.createElement('input');
    dateInput.classList.add('form-input');
    dateInput.setAttribute('id','new-project-date');
    dateInput.setAttribute('name','new-project-date');
    dateInput.setAttribute('type','text');
    form.appendChild(dateLabel);
    form.appendChild(dateInput);
  };

  return {
    getAppContainer, 
    showProjects,
    openCloseFolder,
    getChecklists,
    getAddFolderButton,
    getFormNewFolder,
    getDeleteFolderButton,
    getFormNewItem,
    /*getAddItemButton,
    getDeleteItemButton*/
    };
})();


function getInitialCase(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

//to be bundled in its own startup function
DOMTasks.getAppContainer();
DOMTasks.showProjects();
DOMTasks.openCloseFolder();
DOMTasks.getChecklists();
DOMTasks.getAddFolderButton();
DOMTasks.getDeleteFolderButton(); 
