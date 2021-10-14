// Building a guided learning frontend engine
// player.js that will eventually run a guide on google.com 
// Written by Ortal

const GUIDED_URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=?";
// The url is the same as:
//https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867";
const ActionType = {
    TIP: 'tip',
    CLOSESCENARIO: 'closeScenario'
};

const TOOLTIP_WIDTH = 250;
const TOOLTIP_HEIGHT = 120;

const Placement = {
    RIGHT: 'right',
    LEFT: 'left',
    BOTTOM: 'bottom',
    TOP: 'top'
}

let steps;
let currStepIndex = 0;

function  loadCss(){
     // injecting css
     let styleTag = document.createElement('link');
     // Add attributes
     styleTag.rel = 'stylesheet';
     styleTag.href = 'https://guidedlearning.oracle.com/player/latest/static/css/stTip.css';
     // Attach to the document head
     document.head.appendChild(styleTag);
     console.log("CSS loaded successfully!")
}

// Adding tool tip from css link using jQuery
// window.jQuery is object defined in window global object
// Pulling from an article that was linked to in a comment
function addToolTip(tooltipCss, tip){
    loadCss();

    // Using the below wrapper to place the tip contents
    (window.jQuery)(document.head).append(
        "<style>" + tooltipCss + "</style>");
    (window.jQuery)(document.body).append(
        "<div  class='sttip'> " +
            "<div class='tooltip in'> " +
                "<div class='tooltip-arrow'></div>" +
                "<div class='tooltip-arrow second-arrow'></div>" +
                "<div class='popover-inner'>" +
                    tip +
                "</div>" +
            "</div>" +
        "</div>");
    (window.jQuery)("span[data-iridize-role='stepsCount']").text(steps.length);
    (window.jQuery)("button[data-iridize-role='prevBt']").css({padding: '0 5px'});
    addActionsToTooltip();
    addTooltipContent();
}

// Expands the operations of the Tool tip
function addActionsToTooltip(){
    (window.jQuery)("a[data-iridize-role='nextBt']").click(nextClick);
    (window.jQuery)("button[data-iridize-role='closeBt']").click(closeTooltip);
    (window.jQuery)("button[data-iridize-role='prevBt']").click(backClick);
}

// sets up the tool tip placement
// Using getBoundingClientRect that returns a DOMRect object providing information 
// about the size of an element and its position relative to the viewport.
function setTooltipPlacement(){
    const action = steps[currStepIndex].action;
    const selector = action.selector
    if (!selector || !(window.jQuery)(selector)[0]) {
        const viewPort = (window.jQuery)(document.body)[0].getBoundingClientRect();
        (window.jQuery)('.sttip').css({
            position: 'absolute',
            top: viewPort.bottom / 2,
            left: viewPort.right / 2
        });
        return;
    }
    const selectPositions = (window.jQuery)(selector)[0].getBoundingClientRect();
    let tooltipPosition;
    switch (action.placement){
        case Placement.RIGHT:{
            tooltipPosition = getTooltipPosition(selectPositions.top, selectPositions.right, selectPositions);
            break;
        }
        case Placement.BOTTOM:{
            tooltipPosition = getTooltipPosition(selectPositions.bottom,
            (selectPositions.right + selectPositions.left) / 2,
            selectPositions);
            break;
        }
    }
    (window.jQuery)('.sttip').css({position: 'absolute', ...tooltipPosition});
}

function getTooltipPosition(top, left, selectPositions){
    const bodyPosition = (window.jQuery)(document.body)[0].getBoundingClientRect();
    if(left + TOOLTIP_WIDTH > bodyPosition.right){
        left = selectPositions.left - TOOLTIP_WIDTH;
    }
    if(top + TOOLTIP_HEIGHT > bodyPosition.bottom){
        top = selectPositions.top - TOOLTIP_HEIGHT;
    }
    return {top: top, left: left}
}

function nextClick(){
    const nextStepId = steps[currStepIndex].followers[0].next;
    currStepIndex = steps.findIndex(val => val.id === nextStepId);
    addTooltipContent();
    if(currStepIndex > 0){
        (window.jQuery)("button[data-iridize-role='prevBt']").removeClass('default-prev-btn');
    }
    if(currStepIndex === steps.length - 1){
        (window.jQuery)("a[data-iridize-role='nextBt']").css({display:'none'})
    }
}

function backClick(){
    currStepIndex--;
    if(currStepIndex === 0){
        (window.jQuery)("button[data-iridize-role='prevBt']").addClass('default-prev-btn');
    }
    if(currStepIndex < steps.length - 1){
        (window.jQuery)("a[data-iridize-role='nextBt']").css({display:'block'})
    }
    addTooltipContent();
}

function closeTooltip(){
    (window.jQuery)('.sttip').css({display:'none'});
}

function addTooltipContent(){
    (window.jQuery)("span[data-iridize-role='stepCount']").text(currStepIndex + 1);
    const action = steps[currStepIndex].action;
    let content;
    if(action.type === ActionType.TIP){
        content = action.contents["#content"];
    } else{
        content = '<p>Bravo! You have completed the guide.</p>';
    }
    setTooltipPlacement();
    (window.jQuery)("div[data-iridize-id='content']").html(content);
}

function getSteps(){
    (window.jQuery).getJSON(
        GUIDED_URL,
        (json) => {
            let jsonData = json.data;
            steps = jsonData.structure.steps;
            if(steps && steps.length > 0){
                addToolTip(jsonData.css, jsonData.tiplates.tip);
            }
        }
    );
}

// Loading and Injecting Jquery
(function startGuide(){
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
    document.head.appendChild(scriptTag);
    scriptTag.onload = getSteps;
    console.log("jQuery loaded successfully!");
})()