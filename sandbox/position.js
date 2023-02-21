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
        fetch("https://api.github.com/repos/kotori-archive/resource-card/contents/image", {
            headers: {
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            }
        }).then(response => console.log(response));
    }

    function update() {
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
