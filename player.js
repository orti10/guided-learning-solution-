const GUIDED_LEARNING_DATA_URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=?";
const ActionType = {
    TIP: 'tip',
    CLOSESCENARIO: 'closeScenario'
};

const Placement = {
    RIGHT: 'right',
    LEFT: 'left',
    BOTTOM: 'bottom',
    TOP: 'top'
}

let steps;
let currStepIndex = 0;

// adding tool tip from css link using jQuery
// window.jQuery is object defined in window global object
// pulling from an article that was linked to in a comment
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