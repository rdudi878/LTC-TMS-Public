<b>Please make changes in your own fork, then open a pull request so we can merge back into master.</b>
<br>
*Don't forget to start the Metro bundler before you try to connect a device or emulator*<br>
Some useful commands:<br>
Start metro bundler: react-native start<br>
Build for android: react-native run-android<br>
Build for iOS: react-native run-ios<br>

### Basic commands to put your work on Github

#### step 1: get the base project code onto your computer
copy the codebase to your computer
```
git clone https://github.com/pshiv968/ltctmsAT.git
```

create a branch for your project
```
git checkout -b my_example_branch
```

#### step 2: update/add new code
use a code editor of your choice to make changes

#### step 3: make the version control tool (git) track your new code
(option 1) stage all changes in your directory to be part of the branch history
```
git add .
```

(option 2) stage a file in to be part of the branch history
```
git add ./my_example_file.jsx
```

check which files are staged
```
git status
```

check which lines of code have changed
```
git diff
```

#### step 4: make your changes part of the code's history
add staged files as a single commit to the branch history
```
git commit -m 'this is a message describing what changed in this commit'
```

#### step 5: make the remote server (Github) aware of your updates
(first time) tell Github that there is a new branch and update the branch
```
git push --set-upstream origin my_example_branch
```

(subsequent times) update the branch on Github
```
git push
```
#### Best Practices with Git

#### Cloning from Master Repo and Updating Your Fork

If you are unsure about what git repo will update when using commands like
git push or git commit -m, here is a command to show what repo you are connected to.

```
git remote -v
```

After verifying what repo you are connected to, if you want to change to your own repo,
the correct command is: 
```
git remote set-url origin <your GitHub repo URL.git> 
```
run:
```  
git remote -v 
```
to verify that you are connected to the correct repo.


#### Best Practices with iOS Troubleshooting

1. Clean build within Xcode <br>

2. Check podfile within iOS directory and remove dependencies (if applicable) , then run 
```
pod update
```
 <br>

3. cd to project root directory and run 
```
react-native link
``` 
<br>
4. Run 
npm install
at project root directory <br>

5. Close metro bundler and Xcode, then re-run <br>

6. Check that correct libraries are linked in Xcode <br>

7. Run dos2unix on files that are giving you errors with "\r + \n"
(brew install dos2unix && dos2unix filename.file)

```
#### Is your iOS build breaking?
Try deleting your Podfile.lock in the ios directoy, then rebuild your pods with pod install

Try deleting the xcode workspace file, also in the ios directory

Ask Peter.
