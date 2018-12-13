const mason = require('commander');
const redmine = require('./redmine');
const idRegex = new RegExp('[0-9]{4,5}');
const { version } = require('./package.json');

function parseTaskId(bra)
{

}

function composeGitDeleteCommands(branch){
    console.log("git push origin :origin/" + branch + "\n");
    console.log("git branch -d " + branch + "\n");
};

mason
    .version(version);

mason
    .command('delete-branch <cookieSession> <branch>')
    .description('Check is task is closed and generates the commands to delete the branch (locale and remote).')
    .action((cookieSession, branch) => {

        if(!idRegex.test(branch)){
            throw new Error("This branch has not a valid Redmine Id!!");
        };

        let taskId = branch.match(idRegex)[0];

        redmine.request(taskId, cookieSession, (body) => {
                                    redmine.isTaskClosed(
                                        body,
                                        () => composeGitDeleteCommands(branch),
                                        () => {throw new Error('Branch is not Closed!!');})
                                    }
                        );
    });

mason
    .command('task-status <cookieSession>')
    .option('-b, --branch [branch]', 'The branch with a valid taskID for Redmine')
    .option('-i, --task-id [taskId]', 'The id of the task')
    .description('Get the status for a task.')
    .action((cookieSession, opt) => {
        if(!opt.branch && !opt.taskId){
            throw new Error('And option is required')
        }

        if(opt.branch && !idRegex.test(opt.branch)){
            throw new Error("This branch has not a valid Redmine Id!!");
        };

        taskId = (opt.branch)? opt.branch.match(idRegex)[0] : opt.taskId;

        redmine.request(taskId, cookieSession, (body) => {
                                    redmine.getTaskStatus(body,
                                        (status) => console.log( + status));}
                       );
    });

mason
    .command('*')
    .action(() => {
        mason.help();
});

mason.parse(process.argv);

if (!mason.args.length) { mason.help(); };