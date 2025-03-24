let skills = [
    { skill: 'html', level: 85, tags: ["programmeren", "front-end"], color: 'rgb(255, 0, 0)' },
    { skill: 'css', level: 75, tags: ["programmeren", "front-end"], color: 'rgb(0, 47, 255)' },
    { skill: 'javascript', level: 55, tags: ["programmeren", "front-end"], color: 'rgb(221, 255, 0)' },
    { skill: 'python', level: 80, tags: ["programmeren", "back-end"], color: 'green' }
];

let projects = [
    {
        title: "VulcanoCraft",
        description: "VulcanoCraft is a minecraft server with lots of features, this is the place where I make fun with my friends.",
        images: [
            { src: "pickaxe.webp", alt: "pickaxe", width: 80, height: 80 },
            { src: "dirt.webp", alt: "dirt", width: 50, height: 50 }
        ],
        class: "project2"
    },
    {
        title: "Python desktop apps",
        description: "I made plenty of desktop apps using Python. If you want to see my Python apps, then go to my github page. My most popular Python app is the VulcanoSoftware wifi password extractor",
        class: "project2"
    }
];

let experiences = [
    {
        title: "VulcanoCraft",
        role: "server owner/administrator and developer",
        period: "Sep 2020 - Present",
        class: "xp1"
    },
    {
        title: "VulcanoSoftwareINC",
        role: "founder and developer",
        period: "Sep 2022 - Present",
        class: "xp2"
    },
    {
        title: "CodeAttack",
        role: "founder and developer",
        period: "Feb 2021 - Jun 2022",
        class: "xp3"
    }
];

function generateProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'proj1';
        
        const projectContent = document.createElement('div');
        projectContent.className = project.class;
        projectContent.style.textAlign = 'center';
        projectContent.style.display = 'flex';
        projectContent.style.flexDirection = 'column';
        projectContent.style.justifyContent = 'center';
        projectContent.style.minHeight = '150px';
        projectContent.style.height = 'auto';
        projectContent.style.padding = '20px';
        projectContent.style.width = '100%';
        projectContent.style.maxWidth = '800px';
        projectContent.style.margin = 'auto';
        projectContent.style.marginBottom = '20px';
        projectContent.style.boxSizing = 'border-box';
        
        let content = '';
        
        if (project.images) {
            content += '<div style="margin-bottom: 15px;">';
            project.images.forEach(img => {
                content += `<img src="${img.src}" alt="${img.alt}" style="width:${img.width}px;height:${img.height}px; margin: 0 5px;">`;
            });
            content += '</div>';
        }
        
        content += `<div style="font-size: 28px; margin-bottom: 15px; font-family: 'Press Start 2P', Papyrus, sans-serif; display: inline-block; padding: 5px 15px; border-radius: 10px;"><b>${project.title}</b></div>`;
        
        content += `<div style="width: 100%; max-width: 80%; margin: 0 auto; line-height: 1.6;">${project.description}</div>`;
        
        projectContent.innerHTML = content;
        projectDiv.appendChild(projectContent);
        container.appendChild(projectDiv);
    });
}

function generateExperiences() {
    const container = document.getElementById('experiences-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    experiences.forEach((exp, index) => {
        const expDiv = document.createElement('div');
        expDiv.className = 'proj1';
        
        const expContent = document.createElement('div');
        expContent.className = exp.class || `xp${index + 1}`;
        expContent.style.textAlign = 'center';
        expContent.style.display = 'flex';
        expContent.style.flexDirection = 'column';
        expContent.style.justifyContent = 'center';
        expContent.style.minHeight = '50px';
        expContent.style.height = 'auto';
        expContent.style.padding = '30px';
        expContent.style.font = '15px "Press Start 2P", Papyrus, sans-serif';
        expContent.style.width = '100%';
        expContent.style.maxWidth = '500px';
        expContent.style.border = '5px solid rgb(0, 4, 255)';
        expContent.style.margin = 'auto';
        expContent.style.marginBottom = '20px';
        expContent.style.backgroundColor = 'rgba(26, 110, 255, 0.667)';
        expContent.style.borderRadius = '25px';
        expContent.style.boxSizing = 'border-box';
        
        let content = `
            <div style="display: inline-block; padding: 5px 15px; margin-bottom: 10px; font-weight: bold; font-size: 24px;">${exp.title}</div>
            <div style="margin-bottom: 10px;"><i>${exp.role}</i></div>
            <div>${exp.period}</div>
        `;
        
        expContent.innerHTML = content;
        expDiv.appendChild(expContent);
        container.appendChild(expDiv);
    });
}

function generateSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < skills.length; i += 2) {
        const rowDiv = document.createElement('div');
        rowDiv.className = i === 0 ? 'progcontainer1' : 'progcontainer2';
        
        if (i < skills.length) {
            rowDiv.appendChild(createSkillElement(skills[i], i));
        }
        
        if (i + 1 < skills.length) {
            rowDiv.appendChild(createSkillElement(skills[i + 1], i+1));
        }
        
        container.appendChild(rowDiv);
    }
}

function createSkillElement(skillData, index) {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'prog';
    
    const progressDiv = document.createElement('div');
    progressDiv.className = 'progress';
    
    progressDiv.style.boxSizing = 'content-box';
    progressDiv.style.height = '20px';
    progressDiv.style.margin = '60px 0 20px 0';
    progressDiv.style.background = '#555';
    progressDiv.style.borderRadius = '25px';
    progressDiv.style.padding = '10px';
    progressDiv.style.boxShadow = 'inset 0 -1px 1px rgba(30, 255, 0, 0.3)';
    progressDiv.style.overflow = 'hidden';
    
    const barDiv = document.createElement('div');
    barDiv.id = `${skillData.skill}Bar`;
    barDiv.textContent = skillData.skill;
    barDiv.setAttribute('max', '100');
    
    barDiv.style.width = '30px';
    barDiv.style.height = '20px';
    barDiv.style.borderRadius = '20px';
    barDiv.style.font = 'bold 20px "Handjet", Papyrus, sans-serif';
    barDiv.style.textAlign = 'center';
    
    if (skillData.color) {
        barDiv.style.backgroundColor = skillData.color;
    } else {
        const defaultColors = ['green', 'rgb(255, 0, 0)', 'rgb(0, 47, 255)', 'rgb(221, 255, 0)'];
        barDiv.style.backgroundColor = defaultColors[index % defaultColors.length];
    }
    
    progressDiv.appendChild(barDiv);
    skillDiv.appendChild(progressDiv);
    
    return skillDiv;
}

function setIntervalBar(val, el) {
    let startVal = 0;
    let step = 0.5;
    let speed = 5;
    
    el.style.borderRadius = '20px';
    
    let barInt = setInterval(function () {
        startVal += step;
        if (startVal <= val) {
            el.style.width = startVal + "%";
        } else {
            clearInterval(barInt);
        }
    }, speed);
}

function buildSkillHtml(skill) {
    return `<div class='skill'>
                <div class='skill-title'>
                    ${skill.skill}
                </div>
                <div class="tags"
                    ${printTags(skill)}
                </div>
                <div class="skill-level">
                    ${skill.level}
                </div>
            </div>`;
}

function printTags(skill) {
    let tagsHTML = '';

    skill.tags.forEach(tag => {
        tagsHTML += `<span class="tag">${tag}</span>`;
    });

    return tagsHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        generateProjects();
        generateExperiences();
        generateSkills();
        
        const copyrightYear = document.getElementById('copyright-year');
        if (copyrightYear) {
            copyrightYear.textContent = new Date().getFullYear();
        }
        
        let pythonBar = document.getElementById("pythonBar");
        let htmlBar = document.getElementById("htmlBar");
        let cssBar = document.getElementById("cssBar");
        let javascriptBar = document.getElementById("javascriptBar");
        
        let skillValue = {};
        skills.forEach(skill => {
            skillValue[skill.skill] = skill.level;
        });
        
        let intStarted = false;
        const skillsContainer = document.getElementById('skills-container');
        let BarsY = skillsContainer ? skillsContainer.offsetTop - 570 : 0;

        function animateAllSkillBars() {
            if (!intStarted) {
                skills.forEach(skill => {
                    const barElement = document.getElementById(`${skill.skill}Bar`);
                    if (barElement) {
                        setIntervalBar(skill.level, barElement);
                    }
                });
                intStarted = true;
            }
        }

        if (window.pageYOffset > BarsY) {
            animateAllSkillBars();
        }

        document.addEventListener('scroll', () => {
            if (window.pageYOffset > BarsY) {
                animateAllSkillBars();
            }
            
            const footer = document.querySelector('.copyright-footer');
            const hamburger = document.querySelector('.hamburger');
            const clock = document.querySelector('.clock');
            
            if (footer && hamburger) {
                const footerRect = footer.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (footerRect.top < windowHeight) {
                    hamburger.style.bottom = (windowHeight - footerRect.top + 20) + 'px';
                    
                    if (clock) {
                        clock.style.bottom = (windowHeight - footerRect.top + 20) + 'px';
                    }
                } else {
                    hamburger.style.bottom = '20px';
                    
                    if (clock) {
                        clock.style.bottom = '20px';
                    }
                }
            }
        });

        skills.forEach(skill => {
            const barElement = document.getElementById(`${skill.skill}Bar`);
            if (barElement) {
                barElement.style.width = "30px";
                barElement.setAttribute("value", skill.level);
            }
        });

        const hamburger = document.querySelector('.hamburger-menu');
        const menuIcon = document.getElementById('menuIcon');
        
        if (menuIcon) {
            menuIcon.addEventListener('click', () => {
                menuIcon.classList.add('animate');
                
                setTimeout(() => {
                    if (menuIcon.src.includes('burger-bar.png')) {
                        menuIcon.src = 'close.png';
                        hamburger.classList.add('active');
                    } else {
                        menuIcon.src = 'burger-bar.png';
                        hamburger.classList.remove('active');
                    }
                    menuIcon.classList.remove('animate');
                }, 150);
            });
        }
    } catch (error) {
        console.error('Er is een fout opgetreden bij het initialiseren van de pagina:', error);
    }
});
