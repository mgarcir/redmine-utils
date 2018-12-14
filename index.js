const mason = require('commander');
const redmine = require('./redmine');
const { version } = require('./package.json');

function parseTaskId(taskId, branch){
    const idRegex = new RegExp('[0-9]{4,5}');

    if(!branch && !taskId){
        throw new Error('We need a valid Guid!!')
    }

    if(taskId && !idRegex.test(taskId))
    {
        throw new Error("This is not a valid Redmine Id!!");
    }

    if(branch && !idRegex.test(branch)){
        throw new Error("This branch has not a valid Redmine Id!!");
    };

    return (branch)? branch.match(idRegex)[0] : taskId;
};

function composeGitDeleteCommands(branch){
    console.log("git push origin :origin/" + branch + "; git branch -d " + branch + ";\n");
};

mason
    .version(version);

mason
    .command('delete-branch <cookieSession> <branch>')
    .description('Check is task is closed and generates the commands to delete the branch (locale and remote).')
    .action((cookieSession, branch) => {

        let taskId = parseTaskId(null, branch);

        redmine.request(taskId, cookieSession).
            then((body) => {
                let isClosed = redmine.isTaskClosed(body);
                isClosed? composeGitDeleteCommands(branch) : () => {throw new Error('Branch is not Closed!!')};
            })
            .catch(error => {
                throw new Error('Branch is not Closed!! ');
            });
    });

mason
    .command('task-status <cookieSession>')
    .option('-b, --branch [branch]', 'The branch with a valid taskID for Redmine')
    .option('-i, --task-id [taskId]', 'The id of the task')
    .description('Get the status for a task.')
    .action((cookieSession, opt) => {

        taskId = parseTaskId(opt.taskId, opt.branch);

        redmine.request(taskId, cookieSession).
            then((body) => {
                let status = redmine.getTaskStatus(body);
                console.log("Status is: " + status);
            })
            .catch(error => {
                throw new Error('Branch is not Closed!! ');
            });
    });

mason
    .command('*')
    .action(() => {
        mason.help();
});

mason.parse(process.argv);

if (!mason.args.length) { mason.help(); };