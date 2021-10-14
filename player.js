const GUIDED_LEARNING_DATA_URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=?";
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

// Adding tool tip from css link using jQuery
// window.jQuery is object defined in window global object
// Pulling from an article that was linked to in a comment
function addToolTip(tooltipCss, tip){
    var styleTag = document.createElement('link');
    styleTag.rel = 'stylesheet';
    // Injecting the following css to the page to make the tooltips look good
    styleTag.href = 'https://guidedlearning.oracle.com/player/latest/static/css/stTip.css';
    document.head.appendChild(styleTag);

    // Using the below wrapper to place the tip contents
    (window.jQuery)(document.head).append("<style>" + tooltipCss + "</style>");
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
    if (left + TOOLTIP_WIDTH > bodyPosition.right){
        left = selectPositions.left - TOOLTIP_WIDTH;
    }
    if (top + TOOLTIP_HEIGHT > bodyPosition.bottom){
        top = selectPositions.top - TOOLTIP_HEIGHT;
    }
    return {top: top, left: left}
}


function addTooltipContent(){
    (window.jQuery)("span[data-iridize-role='stepCount']").text(currStepIndex + 1);
    const action = steps[currStepIndex].action;
    let content;
    if (action.type === ActionType.TIP){
        content = action.contents["#content"];
    } else{
        content = '<p>Bravo! You have completed the guide!</p>';
    }
    (window.jQuery)("div[data-iridize-id='content']").html(content);
}