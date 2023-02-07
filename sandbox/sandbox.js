(() => {
    const $ = query => document.querySelector(query);
    const $$ = query => document.querySelectorAll(query);
    const BASE_PATH = "https://raw.githubusercontent.com/kotori-archive/";

    const myCard = [
        {"id": "3563", "status": {"smile": 6040, "pure": 22266, "cool": 9912}, "skill": {"level": 8, "value": ["64", "43%", "19485"]}},
        {"id": "3563", "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 7, "value": ["64", "43%", "19485"]}},
        {"id": "3563", "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 6, "value": ["64", "43%", "19485"]}},
        {"id": "3563", "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 5, "value": ["64", "43%", "19485"]}},
        {"id": "3563", "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 4, "value": ["64", "43%", "19485"]}},
    ];

    function main() {
        initMenu();
        loadCards();
        $(".button-back").addEventListener("click", () => backButton());
    }

    function loadCards() {
        const path = BASE_PATH + "resource-card/main/data.json";
        fetch(path)
            .then(response => response.json())
            .then(json => showCards(json));
    }

    function showCards(data) {
        console.log(data);
        const memberList = $$(".member-list .row");
        myCard.forEach((card, index) => {
            const icon = $(".template .card-icon").cloneNode(true);
            icon.addEventListener("click", () => {
                $(".member-list").classList.toggle("hide");
                showDetails(card);
            });
            memberList[index % 4].appendChild(icon);
        });
    }

    function backButton() {
        console.log("Back Button");
        $(".member-detail .info-panel").classList.toggle("kill");
        $(".member-detail .image").classList.toggle("kill");
        setTimeout(() => {
            $(".member-list").classList.toggle("hide");
            $(".member-detail").classList.toggle("hide");
            $(".member-detail .info-panel").classList.toggle("kill");
            $(".member-detail .image").classList.toggle("kill");
        }, 1000);
    }

    function showDetails(card) {
        console.log(card);
        const detail = $(".member-detail");
        const smile = $(".member-detail .smile");
        const pure = $(".member-detail .pure");
        const cool = $(".member-detail .cool");

        smile.innerText = card.status.smile;
        pure.innerText = card.status.pure;
        cool.innerText = card.status.cool;
        detail.classList.toggle("hide");
    }

    function initMenu() {
        [
            {
                "text": "ホーム",
                "color": "#7ea",
                "hoveredColor": "#8fb",
            },
            {
                "text": "ストーリー",
                "color": "#fb0",
                "hoveredColor": "#fc1",
            },
            {
                "text": "部員",
                "color": "#f87",
                "hoveredColor": "#f98",
            },
            {
                "text": "ライブ",
                "color": "#e28",
                "hoveredColor": "#f39",
            },
            {
                "text": "イベント",
                "color": "#f89",
                "hoveredColor": "#f9a",
            },
            {
                "text": "ショップ",
                "color": "#b9d",
                "hoveredColor": "#cae",
            },
            {
                "text": "勧誘",
                "color": "#f9b",
                "hoveredColor": "#fac",
            },
        ].forEach(parameter => $("#menu").appendChild(button(parameter)));
    }

    function button(parameter) {
        const button = $(".template .button").cloneNode(true);
        const regex = /{{\s*([^{}\s]+)\s*}}/;
        const replace = node => {
            const matched = node.childNodes[0].textContent.match(regex);
            node.textContent = node.textContent.replace(regex, parameter[matched[1]]);
        };
        [...button.querySelectorAll("*")]
            .filter(node => node.childNodes[0].textContent.match(regex))
            .forEach(replace);
        const replaceAttributes = attribute => {
            while (attribute.value.match(regex)) {
                const after = attribute.value.replace(regex, parameter[attribute.value.match(regex)[1]]);
                attribute.ownerElement.setAttribute(attribute.name, after);
            }
        };
        [...button.querySelectorAll("*")]
            .flatMap(node => [...node.attributes])
            .filter(attribute => attribute.value.match(regex))
            .forEach(replaceAttributes);
        return button;
    }

    window.onload = main;
})();
