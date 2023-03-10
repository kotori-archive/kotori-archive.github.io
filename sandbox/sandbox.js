(() => {
    const $ = query => document.querySelector(query);
    const $$ = query => document.querySelectorAll(query);
    const BASE_PATH = "https://raw.githubusercontent.com/kotori-archive/";
    const audioContext = new AudioContext();
    const audioMap = {};
    const backButton = {
        "action": () => {},
        "clear": () => backButton.action = () => {},
        "hide": () => $(".button-back").classList.add("hide"),
        "show": () => $(".button-back").classList.remove("hide"),
    };
    const sceneControl = {
        "destructor": () => {},
        "destruct": () => {
            sceneControl.destructor();
            sceneControl.destructor = () => {};
        },
    };
    const lock = lock => lock ? $("#lock").classList.remove("hide") : $("#lock").classList.add("hide");

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
        initMemberMenu();
        initBackground("000");
        initHome();
        loadCards();
        $(".player-info-bar .heal").addEventListener("click", () => showNotice("?????????") | playAudio("disallow"));
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
        showHome();
    }

    function showNotice(text) {
        const notice = $(".template .notice").cloneNode(true);
        notice.querySelector(".inner").innerText = text;
        $(".container").appendChild(notice);
        setTimeout(() => notice.remove(), 4000);
    }

    function initRandomVoice() {
        let previous = false;
        setInterval(() => {
            const current = !$(".heroine").classList.contains("hide");
            if (previous && current) {
                playRandomVoice();
            }
            previous = current;
        }, 6000);
    }

    function playRandomVoice() {
        const pool = [
            {"key": "voice000", "value": "???????????????????????????????????????????????????"},
            {"key": "voice001", "value": "????????????????????????????????????????????????????????????"},
            {"key": "voice002", "value": "?????????????????????????????????????????????"},
        ];
        const voice = pool[Math.floor(Math.random() * pool.length)];
        playAudio(voice.key);
        $(".conversation").innerText = voice.value;
        $(".conversation").classList.remove("hide");
        $(".conversation").classList.remove("new");
        setTimeout(() => $(".conversation").classList.add("new"), 1);
    }

    function initBackground(id) {
        $(".container").style.backgroundImage = `url("${BASE_PATH}resource-image/main/background/${id}.png")`;
    }

    function initializeAudio() {
        let progress = 0;
        const map = {
            "buttonMain": "sound_effect/001.mp3",
            "buttonCancel": "sound_effect/002.mp3",
            "disallow": "sound_effect/003.mp3",
            "backgroundMain": "background/001.mp3",
            // ???????????????????????????????????????????????????
            "voice000": "voice/000.mp3",
            // ????????????????????????????????????????????????????????????
            "voice001": "voice/001.mp3",
            // ?????????????????????????????????????????????
            "voice002": "voice/002.mp3",
            // ?????????
            "voice003": "voice/003.mp3",
        };
        const log = $("#loading .log");
        const size = Object.keys(map).length;;
        const audioBasePath = `${ BASE_PATH }resource-audio/main/`
        const logs = filename => log.innerText += `Loaded: ${filename}\n`;
        const message = "Done. Click on anywhere to continue";
        const check = () => ++progress == size && (log.innerText += message) | loadingScreen();
        const loadAudio = async entry => await fetch(audioBasePath + entry[1])
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer))
            .then(buffer => (audioMap[entry[0]] = buffer) | logs(entry[1]) | check());
        Object
            .entries(map)
            .forEach(entry => loadAudio(entry));
    }

    function loadingScreen() {
        const loading = $("#loading");
        loading.classList.add("finish");
        loading.addEventListener("click", () => $("#loading .log").remove() | audioContext.resume().then(() => {
            loading.classList.remove("finish");
            const company = $("#loading .company");
            company.classList.remove("hide");
            company.classList.add("animation");
            playAudio("voice003");
            const attention = $("#loading .attention").classList;
            setTimeout(() => company.remove() | attention.remove("hide") | attention.add("animation"), 4000);
            setTimeout(() => loading.remove() | initRandomVoice() | playAudio("backgroundMain", true), 8000);
        }), { "once": true });
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
            icon.style.backgroundImage = `url("${BASE_PATH}resource-card/main/image/${card.id}_0.png")`
            icon.style.backgroundSize = `${master.iconPosition.scale}%`;
            icon.style.border = `solid 6px #${borderColor[data[card.id].type]}`
            icon.addEventListener("click", () => {
                playAudio("buttonMain");
                $(".member-list").classList.add("hide");
                showDetails(card, master);
                backButton.action = () => closeCardDetail();
                updateInterfaceName("????????????");
            });
            memberList[index % 4].appendChild(icon);
        });
    }

    function closeCardDetail() {
        playAudio("buttonCancel");
        $(".member-detail .info-panel").classList.add("kill");
        $(".member-detail .image").classList.add("kill");
        lock(true);
        setTimeout(() => {
            updateInterfaceName("???????????????");
            $(".member-list").classList.remove("hide");
            $(".member-detail").classList.add("hide");
            $(".member-detail .info-panel").classList.remove("kill");
            $(".member-detail .image").classList.remove("kill");
            lock(false);
        }, 1000);
        backButton.action = () => playAudio("buttonCancel") | showMemberMenu();
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

    function showMemberMenu() {
        sceneControl.destruct();
        updateInterfaceName("??????????????????");
        $(".member-menu").classList.add("hide");
        $(".heroine").classList.remove("hide");
        $(".player-info-bar").classList.remove("hide");
        setTimeout(() => $(".member-menu").classList.remove("hide"), 0);
        sceneControl.destructor = () => {
            $(".member-menu").classList.add("hide");
            $(".conversation").classList.add("hide");
            $(".player-info-bar").classList.add("hide");
            $(".heroine").classList.add("hide");
        };
        backButton.action = () => showMemberMenu();
    }

    function showMemberList() {
        sceneControl.destruct();
        sceneControl.destructor = () => {
            $(".member-list").classList.add("hide");
            $(".member-detail").classList.add("hide");
            backButton.clear();
            backButton.hide();
        };
        $(".member-list").classList.remove("hide");
        backButton.show();
        backButton.action = () => playAudio("buttonCancel") | showMemberMenu();
        updateInterfaceName("???????????????");
    }

    function initMemberMenu() {
        const buttons = [
            {
                "text": "??????????????????",
                "color": {
                    "background": "#f56299",
                    "hover": "#f57faa",
                    "font": "#cc4e7c",
                },
                "delay": "0ms",
                "action": () => showNotice("?????????") | playAudio("disallow"),
            },
            {
                "text": "???????????????",
                "color": {
                    "background": "#55c2ff",
                    "hover": "#78cdff",
                    "font": "#469cc7",
                },
                "delay": "50ms",
                "action": () => {
                    playAudio("buttonMain");
                    showMemberList();
                },
            },
        ];
        buttons.forEach(button => {
            const node = $(".template .button-common").cloneNode(true);
            node.querySelector(".layer-2").innerText = button.text;
            node.style.setProperty("--button-color", button.color.background);
            node.style.setProperty("--hover-color", button.color.hover);
            node.style.setProperty("--font-color", button.color.font);
            node.style.setProperty("--delay", button.delay);
            node.addEventListener("click", event => button.action(event));
            $(".member-menu").appendChild(node);
        });
    }

    function showHome() {
        sceneControl.destruct();
        sceneControl.destructor = () => {
            $(".heroine").classList.add("hide");
            $(".player-info-bar").classList.add("hide");
            $(".home").classList.add("hide");
        };
        updateInterfaceName();
        $(".heroine").classList.remove("hide");
        $(".player-info-bar").classList.remove("hide");
        $(".home").classList.remove("hide");
    }

    function initHome() {
        $$(".home .circle-button").forEach(node => {
            node.addEventListener("click", () => showNotice("?????????") | playAudio("disallow"))
        });
    }

    function initMenu() {
        [
            {
                "text": "?????????",
                "color": "#7ea",
                "hoveredColor": "#8fb",
                "click": () => showHome() | playAudio("buttonMain"),
            },
            {
                "text": "???????????????",
                "color": "#fb0",
                "hoveredColor": "#fc1",
                "click": () => showNotice("?????????") | playAudio("disallow"),
            },
            {
                "text": "??????",
                "color": "#f87",
                "hoveredColor": "#f98",
                "click": () => showMemberMenu() | playAudio("buttonMain"),
            },
            {
                "text": "?????????",
                "color": "#e28",
                "hoveredColor": "#f39",
                "click": () => showNotice("?????????") | playAudio("disallow"),
            },
            {
                "text": "????????????",
                "color": "#f89",
                "hoveredColor": "#f9a",
                "click": () => showNotice("?????????") | playAudio("disallow"),
            },
            {
                "text": "????????????",
                "color": "#b9d",
                "hoveredColor": "#cae",
                "click": () => showNotice("?????????") | playAudio("disallow"),
            },
            {
                "text": "??????",
                "color": "#f9b",
                "hoveredColor": "#fac",
                "click": () => showNotice("?????????") | playAudio("disallow"),
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
