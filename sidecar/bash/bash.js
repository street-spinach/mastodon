const {execFile} = require('child_process');

const scriptPath = './create_user.sh'


function executeScript(spinachUserId, email, pass) {

    if (!spinachUserId || !email || !pass) {
        throw new Error('All arguments (spinachUserId, email, pass) must be provided and non-empty.');
    }

    const args = [spinachUserId, email, pass];

    execFile(scriptPath, args, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return error;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return stderr;
        }
        console.log(`Output:\n${stdout}`);
    });

}

module.exports = {
    executeScript
};
