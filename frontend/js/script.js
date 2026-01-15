window.addEventListener('load', async () => {
    const antwoord = await fetch("http://localhost:5000/api");

    const data = await antwoord.json();
    console.log(data);

    const skills = await fetch ("http://localhost:5000/skills");
    const skillsdata = await skills.json();

    for (let i = 0; i < skillsdata.length; i++) {
        let el = skillsdata[i];
        let html = `<p>${el.name} - ${el.skillLevel}% - ${el.category}</p>`;
        document.getElementById("message").innerHTML += html;
    }
})