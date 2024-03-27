function log(l) {
    console.log('keepalive.mjs: ' + l);
}

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function keepalive(url) {
    let r = 0;
    const myRequest = new Request(url);

    for (;;) {
        for (const a in [1, 2, 3, 4, 5]) {
            r = getRandomInt(14567);
            log(`${a} ${r}`);
            await sleep(r);
        }   
        fetch(myRequest)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                log(`status: ${response.statusText}`);
            })
            .catch((error) => {
                log(error);
            })
        ;
    }
}

// keepalive('http://msfish.onrender.com');
keepalive('http://localhost:8080');