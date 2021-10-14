# guided-learning-solution (GLS)

### Welcome to my very first minified Guided Learning Solution (GLS) project!
GLS is a solution that enables step by step guidance on top of any web interface. 

This is a basic GLS uses tooltips from [Oracle Guided Learning](https://education.oracle.com/oracle-cloud-guided-learning).<br>
In this project I have build a guided learning front-end engine that will eventually run a guide on google.com.<br>
The script can inject into google using [DevTools Console](https://developers.google.com/web/tools/chrome-devtools/console).<br>
## 

### Tech:
- [JSONP](https://en.wikipedia.org/wiki/JSONP) endpoint to get a json guide
- [jQuery](https://learn.jquery.com/)

### Features:
- You can go to the next step `->`
- You can go to the previous step `<-`
- Follows all the 5 steps and presents the current step `1/5, 2/5...`
- The tooltip appears in a specific location to it's selector and placement
- You can close the guide anytime

### Setup Instructions:
1. Open Google Chrome
2. Go to [Google](https://www.google.com/)
3. Open your DevTools Console by pressing `F12` OR `ctrl+shift+i` OR `right-click and 'Inspect'`
4. Navigate to the Console tab
5. Copy ALL player.js code
6. Paste player.js in the console and press `Enter`
7. You will see the GLS in action!

