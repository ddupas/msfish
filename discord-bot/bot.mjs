import config from '../config.mjs';
import fs from 'fs';
import {
    Client,
    GatewayIntentBits
} from 'discord.js';

export async function discordlogin() {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds]
    });

    const events = fs
        .readdirSync('./discord-bot/events')
        .filter((file) => file.endsWith('.mjs'));

    // Check for an event and execute the corresponding file in ./events
    for (let event of events) {
        const eventFile = await import(`#events/${event}`);
        // But first check if it's an event emitted once
        if (eventFile.once)
            client.once(eventFile.name, (...args) => {
                eventFile.invoke(...args);
            });
        else
            client.on(eventFile.name, (...args) => {
                eventFile.invoke(...args);
            });
    }

    client.login(config.token);

    return client;
}