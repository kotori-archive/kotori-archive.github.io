(() => {
    const $ = query => document.querySelector(query);
    const $$ = query => document.querySelectorAll(query);
    const BASE_PATH = "https://raw.githubusercontent.com/kotori-archive/";

    function main() {
        $$("#input input").forEach(node => node.oninput = () => update());
        $("#change-image").onclick = () => setImage($("#image-id").value);
        fetchCards();
    }

    function fetchCards() {
        const template = $("#template option");
        const select = $("#card-list");
        const listFiles = "https://api.github.com/repos/kotori-archive/resource-card/contents/image";
        const preprocess = data => data.reduce((map, card) => (map[card.id] = card, map), {});
        const parseCards = response => response
            .map(file => file.name)
            .filter(name => /[0-9]{4}_0\.png/.test(name))
            .forEach(name => {
                const node = template.cloneNode(true);
                const id = name.match(/([0-9]{4})_0\.png/)[1];
                node.innerText = name;
                node.value = id;
                select.appendChild(node);
            });
        let cards = null;
        select.addEventListener("change", () => {
            setImage(select.value);
            update(cards[select.value].iconPosition);
        });
        fetch(BASE_PATH + "resource-card/main/data.json")
            .then(response => response.json())
            .then(json => (cards = preprocess(json), fetch(listFiles)))
            .then(response => response.json())
            .then(response => parseCards(response));
    }

    function update(overwrite) {
        if (overwrite) {
            $("#x").value = overwrite.x;
            $("#y").value = overwrite.y;
            $("#size").value = overwrite.scale;
        }
        const x = $("#x").value;
        const y = $("#y").value;
        const size = $("#size").value;

        const card = $(".card-icon");
        card.style.backgroundPosition = `left ${x}px top ${y}px`;
        card.style.backgroundSize = `${size}%`;
        console.log(`left ${x}px ${y}top px`);

        $("#x-display").innerText = x;
        $("#y-display").innerText = y;
        $("#size-display").innerText = size;
    }

    function setImage(id) {
        console.log("setImage: " + id);
        $(".card-icon").style.backgroundImage = `url("https://raw.githubusercontent.com/kotori-archive/resource-card/main/image/${id}_0.png")`
    }

    window.onload = main;
})();
