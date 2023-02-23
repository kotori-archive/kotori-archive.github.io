(() => {
    const $ = query => document.querySelector(query);
    const $$ = query => document.querySelectorAll(query);
    const BASE_PATH = "https://raw.githubusercontent.com/kotori-archive/";
    const audioContext = new AudioContext();
    const audioMap = {};
    const backButton = {
        "action": () => {},
        "clear": () => backButton.action = () => {},
    };

    const myCard = [
        {"id": "3563", "level": {"current": 120, "max": 120}, "kizuna": {"current": 1000, "max": 1000}, "status": {"smile": 6040, "pure": 22266, "cool": 9912}, "skill": {"level": 8, "value": ["64", "43%", "19485"]}},
        {"id": "2117", "level": {"current": 120, "max": 120}, "kizuna": {"current": 1000, "max": 1000}, "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 7, "value": ["64", "43%", "19485"]}},
        {"id": "1712", "level": {"current": 120, "max": 120}, "kizuna": {"current": 1000, "max": 1000}, "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 6, "value": ["64", "43%", "19485"]}},
        {"id": "1454", "level": {"current": 120, "max": 120}, "kizuna": {"current": 1000, "max": 1000}, "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 5, "value": ["64", "43%", "19485"]}},
        {"id": "2499", "level": {"current": 120, "max": 120}, "kizuna": {"current": 1000, "max": 1000}, "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 4, "value": ["64", "43%", "19485"]}},
        {"id": "3512", "level": {"current": 120, "max": 120}, "kizuna": {"current": 1000, "max": 1000}, "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 4, "value": ["64", "43%", "19485"]}},
        {"id": "3821", "level": {"current": 120, "max": 120}, "kizuna": {"current": 1000, "max": 1000}, "status": {"smile": 0, "pure": 0, "cool": 0}, "skill": {"level": 4, "value": ["64", "43%", "19485"]}},
    ];

    if (true) {
        for (let i = 0; i < 30; i++)
            myCard.push({"id": "3563", "level": {"current": 120, "max": 120}, "kizuna": {"current": 1000, "max": 1000}, "status": {"smile": 6040, "pure": 22266, "cool": 9912}, "skill": {"level": 8, "value": ["64", "43%", "19485"]}});
        for (let i = 0; i < 10; i++)
            myCard.push({"id": "1712", "level": {"current": 120, "max": 120}, "kizuna": {"current": 1000, "max": 1000}, "status": {"smile": 6040, "pure": 22266, "cool": 9912}, "skill": {"level": 8, "value": ["64", "43%", "19485"]}});
    }

    function main() {
        initializeAudio();
        initMenu();
        loadCards();
        $(".button-back").addEventListener("click", () => backButton.action());
        $(".member-list").addEventListener("wheel", event => {
            event.preventDefault();
            const direction = event.deltaY > 0 ? 1 : -1;
            const speed = 20;
            const list = $(".member-list .inner .scroll");
            const maxScroll = list.scrollWidth - list.offsetWidth;
            const result = Math.min(Math.max(0, parseInt(list.style.right, 10) + direction * speed), maxScroll);
            list.style.right = `${ result }px`
        });
        $("#start").addEventListener("click", () => {
            audioContext.resume().then(() => console.log("resumed audio"));
            playAudio("backgroundMain", true);
            $("#start").classList.toggle("hide");
        });
        updateInterfaceName("部員リスト");
    }

    function showNotice(text) {
        const notice = $(".template .notice").cloneNode(true);
        notice.querySelector(".inner").innerText = text;
        $(".container").appendChild(notice);
        setTimeout(() => notice.remove(), 4000);
    }

    function initializeAudio() {
        const map = {
            "buttonMain": "sound_effect/001.mp3",
            "buttonCancel": "sound_effect/002.mp3",
            "disallow": "sound_effect/003.mp3",
            "backgroundMain": "background/001.mp3",
        };
        const audioBasePath = `${ BASE_PATH }resource-audio/main/`
        const loadAudio = async entry => await fetch(audioBasePath + entry[1])
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer))
            .then(buffer => audioMap[entry[0]] = buffer);
        Object
            .entries(map)
            .forEach(entry => loadAudio(entry));
        return audioMap;
    }

    function playAudio(id, loop) {
        const source = audioContext.createBufferSource();
        source.buffer = audioMap[id];
        source.connect(audioContext.destination);
        source.start();
        if (loop) {
            source.loop = true;
        }
    }

    function updateInterfaceName(name) {
        const interfaceName = $(".interface-name");
        if (name) {
            interfaceName.innerText = name;
            interfaceName.classList.remove("hide");
        } else {
            interfaceName.classList.add("hide");
        }
    }

    function loadCards() {
        const path = BASE_PATH + "resource-card/main/data.json";
        const preprocess = data => data.reduce((map, card) => (map[card.id] = card, map), {});
        fetch(path)
            .then(response => response.json())
            .then(json => showCards(preprocess(json)));
    }

    function showCards(data) {
        const memberList = $$(".member-list .row");
        myCard.forEach((card, index) => {
            const icon = $(".template .card-icon").cloneNode(true);
            const master = data[card.id];
            const borderColor = {"smile": "db1e97", "pure": "42cd09", "cool": "5ebaf2"};
            icon.style.backgroundPosition = `left ${master.iconPosition.x}px top ${master.iconPosition.y}px`;
            icon.style.backgroundImage = `url("${BASE_PATH}/resource-card/main/image/${card.id}_0.png")`
            icon.style.backgroundSize = `${master.iconPosition.scale}%`;
            icon.style.border = `solid 6px #${borderColor[data[card.id].type]}`
            icon.addEventListener("click", () => {
                playAudio("buttonMain");
                $(".member-list").classList.toggle("hide");
                $(".member-list-status-bar").classList.toggle("hide");
                showDetails(card, master);
                backButton.action = () => closeCardDetail();
                updateInterfaceName("部員詳細");
            });
            memberList[index % 4].appendChild(icon);
        });
    }

    function closeCardDetail() {
        playAudio("buttonCancel");
        $(".member-detail .info-panel").classList.toggle("kill");
        $(".member-detail .image").classList.toggle("kill");
        setTimeout(() => {
            updateInterfaceName("部員リスト");
            $(".member-list").classList.toggle("hide");
            $(".member-detail").classList.toggle("hide");
            $(".member-list-status-bar").classList.toggle("hide");
            $(".member-detail .info-panel").classList.toggle("kill");
            $(".member-detail .image").classList.toggle("kill");
        }, 1000);
        backButton.clear();
    }

    function showDetails(card, master) {
        const detail = $(".member-detail");
        const image = $("#detailImage");
        const levelCurrent = $("#levelCurrent");
        const levelMax = $("#levelMax");
        const kizunaCurrent = $("#kizunaCurrent");
        const kizunaMax = $("#kizunaMax");
        const smile = $(".member-detail .smile");
        const pure = $(".member-detail .pure");
        const cool = $(".member-detail .cool");
        const skillName = $("#skillName");
        const skillDescription = $("#skillDescription");
        const centerSkillName = $("#centerSkillName");
        const centerSkillDescription = $("#centerSkillDescription");

        image.style.backgroundImage = `url("${BASE_PATH}/resource-card/main/image/${card.id}_0.png")`
        levelCurrent.innerText = card.level.current;
        levelMax.innerText = card.level.max;
        kizunaCurrent.innerText = card.kizuna.current;
        kizunaMax.innerText = card.kizuna.max;
        smile.innerText = card.status.smile;
        pure.innerText = card.status.pure;
        cool.innerText = card.status.cool;
        skillName.innerText = master.skill.name;
        skillDescription.innerText = renderSkill(master.skill.description, card.skill);
        centerSkillName.innerText = master.centerSkill.name;
        centerSkillDescription.innerText = master.centerSkill.description;
        detail.classList.toggle("hide");
    }

    function renderSkill(description, skill) {
        return skill.value.reduce((previous, current) => {
            return previous.replace("{}", current);
        }, description);
    }

    function initMenu() {
        [
            {
                "text": "ホーム",
                "color": "#7ea",
                "hoveredColor": "#8fb",
                "click": () => showNotice("未実装") | playAudio("disallow"),
            },
            {
                "text": "ストーリー",
                "color": "#fb0",
                "hoveredColor": "#fc1",
                "click": () => showNotice("未実装") | playAudio("disallow"),
            },
            {
                "text": "部員",
                "color": "#f87",
                "hoveredColor": "#f98",
                "click": () => showNotice("未実装") | playAudio("disallow"),
            },
            {
                "text": "ライブ",
                "color": "#e28",
                "hoveredColor": "#f39",
                "click": () => showNotice("未実装") | playAudio("disallow"),
            },
            {
                "text": "イベント",
                "color": "#f89",
                "hoveredColor": "#f9a",
                "click": () => showNotice("未実装") | playAudio("disallow"),
            },
            {
                "text": "ショップ",
                "color": "#b9d",
                "hoveredColor": "#cae",
                "click": () => showNotice("未実装") | playAudio("disallow"),
            },
            {
                "text": "勧誘",
                "color": "#f9b",
                "hoveredColor": "#fac",
                "click": () => showNotice("未実装") | playAudio("disallow"),
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
        button.addEventListener("click", event => parameter.click(event));
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
