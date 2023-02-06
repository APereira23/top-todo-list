import './style.css';

const constructors = (() => {
  
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

  return { getProjectIndex, addProject, addToDoItem };
})();


function input() {
  const projIndex = constructors.getProjectIndex();

  projIndex.push(constructors.addProject("Misc"));
  projIndex.push(constructors.addProject("Work"));
  projIndex.push(constructors.addProject("Javascript")); 
  
  projIndex[0].contents.push(constructors.addToDoItem(
    'laundry',
    'Do the Laundry',
    '09/02/2023', 
    'high',
    false
    ));
  
  projIndex[1].contents.push(constructors.addToDoItem(
    'report-validation',
    'Validate team reports', 
    '14/03/2023', 
    'normal', 
    false
  ));

  projIndex[1].contents.push(constructors.addToDoItem(
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

  const showProjects = () => {
    for (let i = 0; i < projData.length; i++) {
      const folder = document.createElement('div');
      folder.classList.add('row', 'project-folder');
      folder.name = projData[i].name;
      folder.id = `proj-${projData[i].name}`;
      document.body.appendChild(folder);
      const foldHeader = document.createElement('div');
      foldHeader.classList.add('folder-header');
      //foldHeader.textContent = folder.id;
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
        //itemHeader.textContent = item.id;
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

  return { showProjects, openCloseFolder, getChecklists };
})();


function getInitialCase(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

DOMTasks.showProjects();
DOMTasks.openCloseFolder();
DOMTasks.getChecklists();
