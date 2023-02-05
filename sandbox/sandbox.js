(() => {
    const $ = query => document.querySelector(query);
    const $$ = query => document.querySelectorAll(query);
    const BASE_PATH = "https://raw.githubusercontent.com/kotori-archive/";

    const myCard = [
        {"id": "3563", "skill": {"level": 8, "value": ["64", "43%", "19485"]}},
        {"id": "3563", "skill": {"level": 8, "value": ["64", "43%", "19485"]}},
        {"id": "3563", "skill": {"level": 8, "value": ["64", "43%", "19485"]}},
        {"id": "3563", "skill": {"level": 8, "value": ["64", "43%", "19485"]}},
        {"id": "3563", "skill": {"level": 8, "value": ["64", "43%", "19485"]}},
    ];

    function main() {
        initMenu();
        loadCards();
    }

    function loadCards() {
        const path = BASE_PATH + "resource-card/main/data.json";
        fetch(path)
            .then(response => response.json())
            .then(json => showCards(json));
    }

    function showCards(data) {
        console.log(data);
        const memberList = $$(".member-list-row");
        myCard.forEach((card, index) => {
            const icon = $(".template .card-icon").cloneNode(true);
            memberList[index % 4].appendChild(icon);
        });
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
