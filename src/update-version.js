'use strict';

const fs = require('fs');
const shell = require('shelljs');

const getPackData = () => {
    return JSON.parse(fs.readFileSync('package.json', 'utf8'));
}

const getCurVer = () => {
    const packageData = getPackData()
    return packageData.version
}

const setNewVer = (curVer, newVer) => {
    const packageData = getPackData()
    packageData.version = newVer
    fs.writeFileSync('package.json', JSON.stringify(packageData));
    shell.cd('src');
    shell.sed('-i', curVer, newVer, 'app-version.js');
}

const currentVer = getCurVer()
const releaseNum = currentVer.split('.');
const patch = +releaseNum[0]
const minor = +releaseNum[1]
const major = +releaseNum[2]
const newVersion = `${patch}.${minor}.${major + 1}`

setNewVer(currentVer, newVersion)




