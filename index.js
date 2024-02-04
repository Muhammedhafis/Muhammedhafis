// index.js

const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const { Configuration, OpenAIApi } = require('openai');
const { sansekai } = require('./suman.js');

const BOT_NAME = process.env.BOT_NAME ?? 'Termux XYZ';
const SESSION_FILE_PATH = './session.json';

// Function to read session data from file
const readSession = () => {
    try {
        return JSON.parse(fs.readFileSync(SESSION_FILE_PATH));
    } catch (err) {
        return null;
    }
};

// Create a new WhatsApp client
const client = new Client({
    session: readSession(),
});

// Function to handle authentication success
client.on('authenticated', (session) => {
    if (!session || !session.WA_USER || !session.WA_AUTHENTICATED) {
        console.log('Authentication failed. Invalid session data.');
        return;
    }

    try {
        console.log('Authentication success');
        fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
    } catch (err) {
        console.error('Error writing session data to file:', err);
    }
});

// Function to handle QR code generation
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Function to handle client readiness
client.on('ready', () => {
    console.log('Client is ready!');
});

// Function to handle incoming messages
client.on('message', async (message) => {
    try {
        const chatUpdate = message?.hasNewMessage && message?.messages?.all()[0];
        if (!chatUpdate) return;

        await sansekai(client, message, chatUpdate, {});
    } catch (err) {
        console.error(err);
    }
});

// Function to handle client errors
client.on('auth_failure', (error) => {
    console.error('Authentication failure:', error);
});

client.on('disconnected', (reason) => {
    console.log('Client was disconnected:', reason);
});

// Start the client
client.initialize();

