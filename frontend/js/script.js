const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000`;
const SKILL_COLORS = ['green', 'rgb(255, 0, 0)', 'rgb(0, 47, 255)', 'rgb(221, 255, 0)'];

let skills = [];
let projects = [];
let experiences = [];
let techstack = [];

function toDomId(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function showEmpty(container, message) {
    container.innerHTML = `<div class="project2"><div class="card-subtitle">${message}</div></div>`;
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '';
    if (projects.length === 0) {
        showEmpty(container, 'Nog geen projecten in de database.');
        return;
    }

    projects.forEach((project) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'proj1';
        wrapper.innerHTML = `
            <div class="project2" style="text-align:center; display:flex; flex-direction:column; justify-content:center; min-height:150px; padding:20px; width:100%; max-width:800px; margin:auto; margin-bottom:20px; box-sizing:border-box;">
                ${project.image ? `<div style="margin-bottom:15px;"><img src="${project.image}" alt="${project.title}" style="width:80px;height:80px; margin:0 5px;"></div>` : ''}
                <div class="card-title" style="margin-bottom:15px; display:inline-block; padding:5px 15px; border-radius:10px;">${project.title}</div>
                <div class="card-subtitle" style="width:100%; max-width:80%; margin:0 auto;">${project.description}</div>
                ${project.tags.length ? `<div class="card-meta" style="margin-top:14px;">Technologies: ${project.tags.join(', ')}</div>` : ''}
            </div>
        `;
        container.appendChild(wrapper);
    });
}

function renderExperiences() {
    const container = document.getElementById('experiences-container');
    if (!container) return;

    container.innerHTML = '';
    if (experiences.length === 0) {
        showEmpty(container, 'Nog geen ervaring in de database.');
        return;
    }

    experiences.forEach((exp, index) => {
        const className = `xp${(index % 4) + 1}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'proj1';
        wrapper.innerHTML = `
            <div class="${className}" style="text-align:center; display:flex; flex-direction:column; justify-content:center; min-height:50px; padding:30px; width:100%; max-width:500px; margin:auto; margin-bottom:20px; box-sizing:border-box;">
                <div class="card-title" style="display:inline-block; padding:5px 15px; margin-bottom:10px;">${exp.title}</div>
                <div class="card-subtitle" style="margin-bottom:10px;">${exp.role}</div>
                <div class="card-meta">${exp.period}</div>
            </div>
        `;
        container.appendChild(wrapper);
    });
}

function renderTechStack() {
    const container = document.getElementById('techstack-container');
    if (!container) return;

    container.innerHTML = '';
    if (techstack.length === 0) {
        showEmpty(container, 'Nog geen tech stack in de database.');
        return;
    }

    techstack.forEach((tech) => {
        const icon = document.createElement('div');
        icon.className = 'techicon';
        icon.innerHTML = `
            <img class="techs" src="${tech.image || 'images/github.webp'}" alt="${tech.alt}" style="width:100px;height:100px;">
            <span class="tooltiptext">${tech.label}</span>
        `;
        container.appendChild(icon);
    });
}

function createSkillElement(skill) {
    const color = skill.color || SKILL_COLORS[0];
    const id = `${skill.idKey}Bar`;

    const element = document.createElement('div');
    element.className = 'prog';
    element.innerHTML = `
        <div class="progress">
            <div id="${id}" style="width:30px; height:20px; border-radius:20px; font:bold 20px 'Handjet'; text-align:center; background-color:${color};">${skill.skill}</div>
        </div>
    `;
    return element;
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    container.innerHTML = '';
    if (skills.length === 0) {
        showEmpty(container, 'Nog geen skills in de database.');
        return;
    }

    for (let i = 0; i < skills.length; i += 2) {
        const row = document.createElement('div');
        row.className = i === 0 ? 'progcontainer1' : 'progcontainer2';
        row.appendChild(createSkillElement(skills[i]));
        if (skills[i + 1]) row.appendChild(createSkillElement(skills[i + 1]));
        container.appendChild(row);
    }
}

function animateSkillBar(targetPercent, barElement) {
    let current = 0;
    const interval = setInterval(() => {
        current += 0.23;
        if (current <= targetPercent) {
            barElement.style.width = `${current}%`;
        } else {
            clearInterval(interval);
        }
    }, 5);
}

function setupSkillBarAnimation() {
    let started = false;
    const skillsContainer = document.getElementById('skills-container');
    const triggerY = skillsContainer ? skillsContainer.offsetTop - 570 : 0;

    function runAnimationIfNeeded() {
        if (started || window.pageYOffset <= triggerY) return;
        skills.forEach((skill) => {
            const bar = document.getElementById(`${skill.idKey}Bar`);
            if (bar) animateSkillBar(skill.level, bar);
        });
        started = true;
    }

    runAnimationIfNeeded();
    window.addEventListener('scroll', runAnimationIfNeeded);
}

function setupFooterAwareFloatingButtons() {
    document.addEventListener('scroll', () => {
        const footer = document.querySelector('.copyright-footer');
        const hamburger = document.querySelector('.hamburger');
        const clock = document.querySelector('.clock');
        if (!footer || !hamburger) return;

        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const newBottom = footerRect.top < windowHeight ? `${windowHeight - footerRect.top + 20}px` : '20px';

        hamburger.style.bottom = newBottom;
        if (clock) clock.style.bottom = newBottom;
    });
}

function setupHamburgerMenu() {
    const menu = document.querySelector('.hamburger-menu');
    const menuIcon = document.getElementById('menuIcon');
    const menuItems = document.querySelector('.menu-items');
    if (!menuIcon || !menuItems || !menu) return;

    const navItems = [
        { href: '#projects', text: 'Projects' },
        { href: '#experiences', text: 'Experience' },
        { href: '#techstack', text: 'Tech Stack' },
        { href: '#skills', text: 'Skills' },
        { href: '#contact', text: 'Contact' }
    ];

    const existingItems = menuItems.innerHTML;
    let navHtml = '';
    navItems.forEach((item) => {
        navHtml += `<a href="${item.href}">${item.text}</a>`;
    });
    menuItems.innerHTML = `${navHtml}<div style="border-top: 1px solid rgba(255,255,255,0.3); margin: 10px 15px;"></div>${existingItems}`;

    menuIcon.addEventListener('click', () => {
        menuIcon.classList.add('animate');
        setTimeout(() => {
            const isClosed = menuIcon.src.includes('images/burger-bar.png');
            menuIcon.src = isClosed ? 'images/close.png' : 'images/burger-bar.png';
            menu.classList.toggle('active', isClosed);
            menuIcon.classList.remove('animate');
        }, 150);
    });

    menuItems.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menuIcon.src = 'images/burger-bar.png';
            menu.classList.remove('active');
        });
    });
}

function normalizeApiData() {
    skills = skills.map((item, index) => {
        const name = item.name || 'skill';
        return {
            skill: name,
            level: Math.max(0, Math.min(100, Number(item.skillLevel ?? 0))),
            color: SKILL_COLORS[index % SKILL_COLORS.length],
            idKey: toDomId(name)
        };
    });

    projects = projects.map((item) => ({
        title: item.name || 'Project',
        description: item.description || 'No description provided.',
        image: item.image || null,
        tags: Array.isArray(item.tags) ? item.tags : []
    }));

    experiences = experiences.map((item) => ({
        title: item.title || 'Experience',
        role: item.role || 'No role provided',
        period: item.period || 'No period provided'
    }));

    techstack = techstack.map((item) => ({
        label: item.label || item.name || 'tech',
        image: item.image || null,
        alt: item.alt || item.name || 'tech'
    }));
}

async function loadDataFromApi() {
    try {
        const [skillsResponse, projectsResponse, experiencesResponse, techstackResponse] = await Promise.all([
            fetch(`${API_BASE}/getallskills`),
            fetch(`${API_BASE}/getallprojects`),
            fetch(`${API_BASE}/getallexperiences`),
            fetch(`${API_BASE}/getalltechstack`)
        ]);

        skills = skillsResponse.ok ? await skillsResponse.json() : [];
        projects = projectsResponse.ok ? await projectsResponse.json() : [];
        experiences = experiencesResponse.ok ? await experiencesResponse.json() : [];
        techstack = techstackResponse.ok ? await techstackResponse.json() : [];
    } catch (error) {
        console.warn('API niet beschikbaar, er wordt geen data getoond.', error);
        skills = [];
        projects = [];
        experiences = [];
        techstack = [];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadDataFromApi();
    normalizeApiData();

    renderProjects();
    renderExperiences();
    renderTechStack();
    renderSkills();

    const year = document.getElementById('copyright-year');
    if (year) year.textContent = new Date().getFullYear();

    setupSkillBarAnimation();
    setupFooterAwareFloatingButtons();
    setupHamburgerMenu();
});

