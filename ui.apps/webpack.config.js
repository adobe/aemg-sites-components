/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
const path = require('path');
const glob = require('glob');
module.exports = {
    entry: getEntryPoints(), // Replace with your TypeScript entry file path
    output: {
        path: path.resolve(__dirname),
        filename: '[name].js' // Replace with your desired output filename
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};

function getEntryPoints() {
    const entryPoints = {};
    const files = glob.sync('./src/**/*.ts'); // Use glob pattern to get all TypeScript files inside 'src' directory

    files.forEach((file) => {
        const lastSlashIndex = file.lastIndexOf('/');
        const lastDotIndex = file.lastIndexOf('.');
        const templFile = file.substring(0, file.length-3);
        const entryName = templFile;// Extract entry name from file path
        entryPoints[entryName] = "./" + file; // Set entry point for each file
    });

    return entryPoints;
}