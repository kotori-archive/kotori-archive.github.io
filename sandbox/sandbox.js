(() => {
    const $ = query => document.querySelector(query);

    function main() {
        console.log("Hello World!");
        initMenu();
    }

    function initMenu() {
        console.log($(".template .button"));
        const add = parameter => $("#menu").appendChild(button(parameter));
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
