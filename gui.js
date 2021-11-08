/*

    gui.js

    a programming environment
    based on morphic.js, blocks.js, threads.js and objects.js
    inspired by Scratch

    written by Jens Mönig
    jens@moenig.org

    Copyright (C) 2017 by Jens Mönig

    This file is part of Snap!.

    Snap! is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


    prerequisites:
    --------------
    needs blocks.js, threads.js, objects.js and morphic.js


    toc
    ---
    the following list shows the order in which all constructors are
    defined. Use this list to locate code in this document:

        IDE_Morph
        ProjectDialogMorph
        SpriteIconMorph
        TurtleIconMorph
        CostumeIconMorph
        WardrobeMorph
        StageHandleMorph;
        PaletteHandleMorph;


    credits
    -------
    Nathan Dinsmore contributed saving and loading of projects,
    ypr-Snap! project conversion and countless bugfixes
    Ian Reynolds contributed handling and visualization of sounds
    Michael Ball contributed the LibraryImportDialogMorph and countless
    utilities to load libraries from relative urls

*/

/*global modules, Morph, SpriteMorph, SyntaxElementMorph, Color,
ListWatcherMorph, TextMorph, newCanvas, useBlurredShadows, VariableFrame,
StringMorph, Point, MenuMorph, morphicVersion, DialogBoxMorph,
ToggleButtonMorph, contains, ScrollFrameMorph, StageMorph, PushButtonMorph,
InputFieldMorph, FrameMorph, Process, nop, SnapSerializer, ListMorph, detect,
AlignmentMorph, TabMorph, Costume, MorphicPreferences, Sound, BlockMorph,
ToggleMorph, InputSlotDialogMorph, ScriptsMorph, isNil, SymbolMorph,
BlockExportDialogMorph, BlockImportDialogMorph, SnapTranslator, localize,
List, ArgMorph, SnapCloud, Uint8Array, HandleMorph, SVG_Costume,
fontHeight, hex_sha512, sb, CommentMorph, CommandBlockMorph,
BlockLabelPlaceHolderMorph, Audio, SpeechBubbleMorph, ScriptFocusMorph,
XML_Element, WatcherMorph, BlockRemovalDialogMorph, saveAs, TableMorph,
isSnapObject, isRetinaEnabled, disableRetinaSupport, enableRetinaSupport,
isRetinaSupported, SliderMorph, Animation, utils*/

// Global stuff ////////////////////////////////////////////////////////

modules.gui = '2017-April-23';

// Declarations

var IDE_Morph;
var ProjectDialogMorph;
var LibraryImportDialogMorph;
var SpriteIconMorph;
var CostumeIconMorph;
var TurtleIconMorph;
var WardrobeMorph;
var SoundIconMorph;
var JukeboxMorph;
var StageHandleMorph;
var PaletteHandleMorph;
var AgentMorph;

var intervention = false;
var interventionNumber = null;

var SERVER_URL = SERVER_URL || window.location.origin;
var SERVER_ADDRESS = SERVER_URL.replace(/^.*\/\//, '');



function ensureFullUrl(url) {
    // if it's not a full path attach serverURL to the front
    // regex is checking to see if the protocol is there (eg http://, ws://)
    if(url.match(/^\w+:\/\//) === null) {
        if (url.substring(0,1)[0] === '/') {
            url = SERVER_URL + url;
        } else {
            url = SERVER_URL + '/' + url;
        }
    }
    return url;
}

var conversationPause = false;
var conversationReplay = false;

var conversationHistory = [];
var speakerHistory = [];

var countButtonCreated = 0

var activity_dialogues;

// here we define the dialogues included in each activity
var activity_1_dialogues = [null];
var activity_2_dialogues = [1, 2];
var activity_2_additional_dialogues = [3];
var activity_3_dialogues = [4];
var activity_3_additional_dialogues = [5];
var activity_4_dialogues = [6];
var activity_4_additional_dialogues = [7];

var intervention_dialogues_INACTIVITY_inactive_coding = [14];
var intervention_dialogues_INACTIVITY_inactive_talking = [15];
var intervention_dialogues_INACTIVITY_distraction = [16];

var intervention_dialogues_GOOD_TEAMWORK_asking_why = [17]
var intervention_dialogues_GOOD_TEAMWORK_sharing_ideas = [18]
var intervention_dialogues_GOOD_TEAMWORK_listening_to_each_other = [19]

var intervention_dialogues_CONFLICT_not_asking_why = [20]
var intervention_dialogues_CONFLICT_not_sharing_ideas = [21]
var intervention_dialogues_CONFLICT_not_listening_to_each_other = [22]

var intervention_dialogues_CONFUSION_activity_2_object = [23]
var intervention_dialogues_CONFUSION_activity_3_object = [24]
var intervention_dialogues_CONFUSION_activity_4_object = [25]
var intervention_dialogues_CONFUSION_floudering = [26]
var intervention_dialogues_CONFUSION_activity_2_hint = [27]
var intervention_dialogues_CONFUSION_activity_3_hint = [28]
var intervention_dialogues_CONFUSION_activity_4_hint = [29]
// Here are all agent dialogues, audios, and animations

// Here are all agent dialogues, audios, and animations

/* Conversation 1 -- Agent Introduction */
var futureConversation1 = [
    null,
    "Hi, I’m Viviana. But you can call me Vivi.",
    null,
    "My name's Jeremy, but you can call me Jay.",
    null,
    "We heard you will be coding today.",
    "We did some coding at our school too!",
    "We were partners, and you're gonna have a partner too.",
    null,
    "Good luck!"
];
var futureSpeaker1 = [null, 'v', null,'j', null, 'v', 'j', 'v', null, 'j'];
var futureAudio1 = [
    null,
    "1_Introduction_Viviana.mp3",
    null,
    "2_Introduction_Jeremy.mp3",
    null,
    "3_Introduction_Viviana.mp3",
    "4_Introduction_Jeremy.mp3",
    "5_Introduction_Viviana.mp3",
    null,
    "6_Introduction_Jeremy.mp3"
];
// var audioTimes1 = [1, 2.372, 1, 3.596, 1, 1.633, 2.616, 2.722, 1, 1.512];
var audioTimes1 = [2, 1.260, 1.164, 1.497, 0.980, 2.704, 2.673, 1.159, 1.625, 0.613];
var futureImages1 = [45, 60, 22, 38, 32, 64, 37, 52, 18, 63];

/* Conversation 2 -- Activity 1 - Vignette 1 */
var futureConversation2 = [
    null,
    "Jeremy, we did debugging in school too, right?",
    null,
    "Yeah, we did. I remember we couldn’t figure out that one activity, but we eventually got it.",
    null,
    null,
    null,
    null,
    null,
    "Aagh. We need to change our code.",
    null,
    "But, why?",
    "Cause, see? It's not working.",
    "Yeah. Let's try to figure it out block by block.",
    null,
    null,
    "Ooh. I think I see the problem.",
    "We just had to ask “why” to figure it out."
];
var futureSpeaker2 = [null, 'v', null, 'j', null, null, null, null, null, 'j', null, 'v', 'j', 'v', null, null, 'j', 'v'];
var futureAudio2 = [
    null,
    "1_Activity1_ActivityIntro_Viviana.mp3",
    null,
    "2_Activity1_ActivityIntro_Jeremy.mp3",
    null,
    null,
    null,
    null,
    null,
    "1_Activity1_Vignette1_Jeremy.mp3",
    null,
    "2_Activity1_Vignette1_Viviana.mp3",
    "3_Activity1_Vignette1_Jeremy.mp3",
    "4_Activity1_Vignette1_Viviana.mp3",
    null,
    null,
    "5_Activity1_Vignette1_Jeremy.mp3",
    "6_Activity1_Vignette1_Viviana.mp3"
];
// var audioTimes2 = [1, 2.752, 1, 1.039, 5.016, 1, 1, 1, 1, 3.192, 1, 0.661, 2.496, 3.455, 1, 1, 3.247, 2.030];
var audioTimes2 = [2, 0.609, 1.999, 1.204, 2.380, 1.068, 2, 2, 2, 1.095, 2.102, 0.510, 3.221, 1.200, 2.304, 3, 3.022, 2.088];
var futureImages2 = [35, 53, 9, 36, 33, 61, 35, 91, 86, 80, 77, 70, 82, 70, 90, 100, 96, 96];

/* Conversation 3 -- Activity 1 - Vignette 2 */
var futureConversation3 = [
    null,
    "(Laughs) Jeremy, I don’t understand. *Whyy* is it so important to ask “whyy” questions?",
    null,
    null,
    "That's a great question! We have to ask 'why' so we can understand each other's ideas.",
    null,
    null,
    "Like for example: 'Whyyy did you use that block'?",
    null,
    "You got it!"
];
var futureSpeaker3 = [null, 'v', null, null, 'j', null, null, 'v', null, 'j'];
var futureAudio3 = [
    null,
    "1_Activity1_Vignette2_Viviana.mp3",
    null,
    null,
    "2_Activity1_Vignette2_Jeremy.mp3",
    null,
    null,
    "3_Activity1_Vignette2_Viviana.mp3",
    null,
    "4_Activity1_Vignette2_Jeremy.mp3"
];
// var audioTimes3 = [1, 3.557, 1, 4.224, 1];
var audioTimes3 = [1, 0.734, 0.288, 5.175, 1.858, 0.644, 2.108, 2.190, 2.486, 0.533];
var futureImages3 = [35, 21, 53, 11, 27, 46, 48, 7, 55, 63];

/* Conversation 4 -- Activity 2 - Vignette 1 */
var futureConversation4 = [
    null,
    "Hey, I remember doing an activity like this one at school!",
    null,
    "Me too. It was hard at first, but we figured it out!”",
    null,
    null,
    null,
    null,
    null,
    "Hmm. Why isn’t our code working?",
    "Here, I can fix it!",
    "Hey! I was working on it.",
    "Sorry. I shouldn't have tried to take over.",
    "Don’t worry Jay. I think I will change these numbers.",
    null,
    "Well, I had this idea...",
    null,
    "Hey, your idea was pretty good!",
    "Thanks Viviana! That actually worked!"
];
var futureSpeaker4 = [null, 'j', null, 'v', null, null, null, null, null, 'v', 'j', 'v', 'j', 'v', null, 'j', null, 'v', 'j'];
var futureAudio4 = [
    null,
    "1_Activity2_ActivityIntro_Jeremy.mp3",
    null,
    "2_Activity2_ActivityIntro_Viviana.mp3",
    null,
    null,
    null,
    null,
    null,
    "1_Activity2_Vignette1_Viviana.mp3",
    "2_Activity2_Vignette1_Jeremy.mp3",
    "3_Activity2_Vignette1_Viviana.mp3",
    "4_Activity2_Vignette1_Jeremy.mp3",
    "5_Activity2_Vignette1_Viviana.mp3",
    null,
    "6_Activity2_Vignette1_Jeremy.mp3",
    null,
    "7_Activity2_Vignette1_Viviana.mp3",
    "8_Activity2_Vignette1_Jeremy.mp3"
];
// var audioTimes4 = [1, 4.296, 1, 3.161, 1];
var audioTimes4 = [2, 0.955, 2.386, 0.840, 1.022, 2, 1, 1, 1, 2.677, 1.185, 2.256, 2.142, 0.963, 2.613, 1.751, 2, 1.790, 2.283];
var futureImages4 = [35, 35, 33, 53, 14, 18, 35, 92, 86, 73, 81, 71, 79, 76, 74, 84, 100, 98, 98];

/* Conversation 5 -- Activity 2 - Vignette 2 */
var futureConversation5 = [
    null,
    "It isn't just me who likes to share ideas. I ask Vivi for her ideas.",
    null,
    "Totally man! It goes something like this: *Ahem* 'Vivi, do you know what we should do?'",
    null,
    null,
    "And she goes:'Dude, I have like a bajillion ideas!'",
    null,
    "I never said that! I say I have a *thousand* ideas, there is a difference.",
    null,
    null,
    null,
    "But you should try sharing ideas with your partner too. It can come in handy a lot!",
    null
];
var futureSpeaker5 = [null, 'j', null, 'v', null, null, 'j', null, 'v', null, null, null, 'v', null];
var futureAudio5 = [
    null,
    "1_Activity2_Vignette2_Jeremy.mp3",
    null,
    "2_Activity2_Vignette2_Viviana.mp3",
    null,
    null,
    "3_Activity2_Vignette2_Jeremy.mp3",
    null,
    "4_Activity2_Vignette2_Viviana.mp3",
    null,
    null,
    "4.5_Activity2_Vignette2_Both.mp3",
    "5_Activity2_Vignette2_Viviana.mp3",
    null
];
// var audioTimes5 = [1, 4.250, 1, 5, 1, 1, 3.284, 1, 1.680];
var audioTimes5 = [2, 2.352, 1.652, 2.454, 0.825, 1.620, 1.908, 1.826, 1.526, 2.643, 0.927, 2, 2.577, 1.750];
var futureImages5 = [35, 46, 49, 57, 16, 55, 27, 28, 15, 57, 12, 27, 57, 58];

/* Conversation 6 -- Activity 3 - Vignette 1 */
var futureConversation6 = [
    null,
    "Hey, we worked on something just like this too.",
    null,
    "It was kinda hard, but we worked it out.",
    null,
    null,
    null,
    null,
    "Vivi, I’m going to put this block over here.",
    null,
    "I don’t think that’s what we’re supposed to do.",
    "Oh. That didn’t work.",
    null,
    "We should put it over there, because that will make it work.",
    null,
    "Oh, you’re right. Let me drag it over here, and…",
    null,
    "It worked! Nice one, Vivi!",
    "Yeah! Thanks for taking my suggestion!",
];
var futureSpeaker6 = [null, 'v', null, 'j', null, null, null, null, 'j', null, 'v', 'j', null, 'v', null, 'j', null, 'j', 'v'];
var futureAudio6 = [
    null,
    "1_Activity3_ActivityIntro_Viviana.mp3",
    null,
    "2_Activity3_ActivityIntro_Jeremy.mp3",
    null,
    null,
    null,
    null,
    "1_Activity3_Vignette1_Jeremy.mp3",
    null,
    "2_Activity3_Vignette1_Viviana.mp3",
    "3_Activity3_Vignette1_Jeremy.mp3",
    null,
    "4_Activity3_Vignette1_Viviana.mp3",
    null,
    "5_Activity3_Vignette1_Jeremy.mp3",
    null,
    "6_Activity3_Vignette1_Jeremy.mp3",
    "8_Activity3_Vignette1_Viviana.mp3",
];
// var audioTimes6 = [1, 5.424, 1, 3.240, 1, 1, 1, 1, 1, 2.887, 1.368, 2.806, 2.747, 3.534, 1, 2.165, 1, 2.090, 2.843];
var audioTimes6 = [2, 0.525, 2.352, 1.343, 0.625, 2, 2, 2, 1.276, 1.549, 2.880, 1.265, 0.8, 1.650, 1.350, 1.271, 1.961, 1.505, 1.895];
var futureImages6 = [35, 10, 58, 44, 61, 35, 93, 86, 85, 84, 71, 78, 79, 70, 89, 84, 87, 98, 98];

/* Conversation 7 -- Activity 3 - Vignette 2 */
var futureConversation7 = [
    null,
    "Sometimes when I am focused, I forget to listen to Jeremy.",
    null,
    "But sometimes I’ll see something Vivi missed.",
    null,
    "Yeah. You should listen to your partner’s ideas.",
    null
];
var futureSpeaker7 = [null, 'v', null, 'j', null, 'v', null];
var futureAudio7 = [
    null,
    "1_Activity3_Vignette2_Viviana.mp3",
    null,
    "2_Activity3_Vignette2_Jeremy.mp3",
    null,
    "3_Activity3_Vignette2_Viviana.mp3",
    null
];
// var audioTimes7 = [1, 3.513, 1, 6.648, 1, 1];
var audioTimes7 = [2, 1.950, 1.956, 1.035, 1.297, 0.674, 1.969];
var futureImages7 = [35, 8, 15, 44, 48, 59, 57];

/* Conversation 13 -- Praise */
var futureConversation13 = [
    "Great effort!",
    "Good job!",
    "Good job working together!",
    "Nice work!",
    "Very good collaboration! Keep going!",
    "Great effort!",
    "Good job!",
    "Good job working together!",
    "Nice work!",
    "Very good collaboration! Keep going!",
];
var futureSpeaker13 = ['v', 'v', 'v', 'v', 'v', 'j', 'j', 'j', 'j', 'j'];
var futureAudio13 = [
    "1_Vivi_Praise_GreatEffort_1.mp3",
    "1_Vivi_Praise_GoodJob_1.mp3",
    "1_Vivi_Praise_GoodJobWorkingTogether.mp3",
    "1_Vivi_Praise_NiceWork_1.mp3",
    "1_Vivi_Praise_VeryGoodCollaboration_1.mp3",
    "1_Jay_Praise_GreatEffort_1.mp3",
    "1_Jay_Praise_GoodJob_1.mp3",
    "1_Jay_Praise_GoodJobWorkingTogether.mp3",
    "1_Jay_Praise_NiceWork_1.mp3",
    "1_Jay_Praise_VeryGoodCollaboration_1.mp3",
];
var audioTimes13 = [0.998, 0.780, 1.528, 0.967, 2.526, 0.889, 0.629, 1.466, 0.925, 2.653];
var futureImages13 = [21, 21, 20, 20, 21, 22, 22, 18, 18, 22];

/* Conversation 14 -- INACTIVITY / Inactive Coding */
var futureConversation14 = [
    null,
    "When I’m coding, I need to press the Green Flag to see what our code’s doing first.",
    null,
    "Yeah, why not try pressing the Green Flag? That helps us think about what to do next!",
    null
];
var futureSpeaker14 = [null, 'j', null, 'v', null];
var futureAudio14 = [
    null,
    "1_Wizard_InactiveCoding_Jeremy.mp3",
    null,
    "2_Wizard_InactiveCoding_Viviana.mp3",
    null
];
var audioTimes14 = [2, 2.288, 1.416, 2.346, 1.847];
var futureImages14 = [35, 50, 49, 56, 54];

/* Conversation 15 -- INACTIVITY / Inactive Talking */
var futureConversation15 = [
    null,
    "Teamwork is all about communication. If you two shared your ideas with each other, maybe it’d get the ball rolling!",
    null,
    null
];
var futureSpeaker15 = [null, 'j', null, null];
var futureAudio15 = [
    null,
    "1_Wizard_InactiveTalking_Jeremy.mp3",
    null,
    null
];
var audioTimes15 = [2, 2.004, 1.829, 1.209];
var futureImages15 = [35, 48, 50, 47];

/* Conversation 16 -- INACTIVITY / Distraction */
var futureConversation16 = [
    null,
    "Hey! Are you two still coding? Where were we?",
    null
];
var futureSpeaker16 = [null, 'v', null];
var futureAudio16 = [
    null,
    "1_Wizard_Distracted_Viviana.mp3",
    null
];
var audioTimes16 = [1, 2.084, 0.73];
var futureImages16 = [35, 59, 11];

/* Conversation 17 -- GOOD TEAMWORK / Asking Why Questions */
var futureConversation17 = [
    null,
    "Nice work asking why questions to each other!",
];
var futureSpeaker17 = [null, 'v'];
var futureAudio17 = [
    null,
    "1_Wizard_PraiseWhy_Viviana.mp3"
];
var audioTimes17 = [2, 2.507];
var futureImages17 = [35, 54];

/* Conversation 18 -- GOOD TEAMWORK / Sharing Ideas */
var futureConversation18 = [
    null,
    "Great job sharing your ideas with each other! You make an awesome team!",
    null
];
var futureSpeaker18 = [null, 'j', null];
var futureAudio18 = [
    null,
    "1_Wizard_PraiseSharing_Jeremy.mp3",
    null
];
var audioTimes18 = [2, 1.922, 1.252];
var futureImages18 = [35, 62, 25];

/* Conversation 19 -- GOOD TEAMWORK / Listening to Each Other */
var futureConversation19 = [
    null,
    "You two are the best team ever! Great job listening to each other!",
    null
];
var futureSpeaker19 = [null, 'v', null];
var futureAudio19 = [
    null,
    "1_Wizard_PraiseListening_Viviana.mp3",
    null
];
var audioTimes19 = [1, 2.066, 1.744];
var futureImages19 = [35, 23, 54];

/* Conversation 20 -- CONFLICT / Not Asking Why 1 */
var futureConversation20 = [
    null,
    "Our teacher Ms. Diaz said that it's very important to ask “why” questions to each other.",
    null,
    "Yes. So we ask questions like: “Why do you think that?”",
    null
];
var futureSpeaker20 = [null, 'j', null, 'v', null];
var futureAudio20 = [
    null,
    "1_Wizard_EncourageWhy1_Jeremy.mp3",
    null,
    "2_Wizard_EncourageWhy1_Viviana.mp3",
    null
];
var audioTimes20 = [2, 2.352, 1.717, 2.405, 1.044];
var futureImages20 = [35, 48, 47, 57, 11];

/* Conversation 21 -- CONFLICT / Not Sharing Ideas */
var futureConversation21 = [
    null,
    "I’ve learned Jeremy has great ideas that I would've never thought of in a million years!",
    null,
    null,
    "You too! So try and share your ideas, even if you aren’t sure.",
    null,
    null
];
var futureSpeaker21 = [null, 'v', null, null, 'j', null, null];
var futureAudio21 = [
    null,
    "1_Wizard_EncourageSharing1_Viviana.mp3",
    null,
    null,
    "2_Wizard_EncourageSharing1_Jeremy.mp3",
    null,
    null
];
var audioTimes21 = [2, 2.133, 1.534, 1.296, 0.765, 1.897, 0.901];
var futureImages21 = [35, 59, 58, 23, 39, 49, 48];

/* Conversation 22 -- CONFLICT / Not Listening to Each Other */
var futureConversation22 = [
    null,
    "When I’m coding, sometimes I want to take over the world and forget to listen to Vivi.",
    null,
    null,
    "Yeah, he missed a really good idea I had earlier.",
    null,
    "Yeah… Listening to your partner is pretty important.",
    null
];
var futureSpeaker22 = [null, 'j', null, null, 'v', null, 'j', null];
var futureAudio22 = [
    null,
    "1_Wizard_EncourageListening_Jeremy.mp3",
    null,
    null,
    "2_Wizard_EncourageListening_Viviana.mp3",
    null,
    "3_Wizard_EncourageListening_Jeremy.mp3",
    null
];
var audioTimes22 = [2, 1.820, 1.758, 1.675, 0.690, 2.318, 1.302, 2.591];
var futureImages22 = [35, 40, 39, 41, 59, 10, 43, 40];

/* Conversation 23 -- CONFUSION (ACTIVITY 1) / Objective */
var futureConversation23 = [
    null,
    "Hmm. Looks like in this one you need to make Alonzo move in a square.",
    null,
    "I wonder how you could make him move the right way.",
    null
];
var futureSpeaker23 = [null, 'v', null, 'j', null];
var futureAudio23 = [
    null,
    "1_Activity1_Overview_Viviana.mp3",
    null,
    "2_Activity1_Overview_Jeremy.mp3",
    null
];
var audioTimes23 = [2, 0.810, 3.722, 1.148, 0.906];
var futureImages23 = [35, 31, 10, 44, 49];

/* Conversation 24 -- CONFUSION (ACTIVITY 2) / Objective */
var futureConversation24 = [
    null,
    "It looks like you need to make Kitty, Alonzo and Ladybug all move forever.",
    null,
    "Hope they get to take a nap after that!"
];
var futureSpeaker24 = [null, 'j', null, 'v'];
var futureAudio24 = [
    null,
    "1_Activity2_Overview_Jeremy.mp3",
    null,
    "2_Activity2_Overview_Viviana.mp3"
];
var audioTimes24 = [2, 2.943, 0.918, 2.269];
var futureImages24 = [35, 44, 48, 12];

/* Conversation 25 -- CONFUSION (ACTIVITY 3) / Objective */
var futureConversation25 = [
    null,
    "Looks like you need to make all of your sprites talk when they touch each other.",
    null,
    "That’s gonna look awesome!"
];
var futureSpeaker25 = [null, 'j', null, 'v'];
var futureAudio25 = [
    null,
    "1_Activity3_Overview_Jeremy.mp3",
    null,
    "2_Activity3_Overview_Viviana.mp3"
];
var audioTimes25 = [2, 2.201, 0.960, 1.848];
var futureImages25 = [35, 44, 48, 23];

/* Conversation 26 -- CONFUSION / Floudering */
var futureConversation26 = [
    null,
    "Our teacher Ms. Diaz told us: “You always need a plan of action with your teammate!”",
    null,
    "She says: “How can you break this big problem into smaller pieces? What is the next step?”",
    null,
    null
];
var futureSpeaker26 = [null, 'v', null, 'j', null, null];
var futureAudio26 = [
    null,
    "1_Wizard_Floundering_Viviana.mp3",
    null,
    "2_Wizard_Floundering_Jeremy.mp3",
    null,
    null
];
var audioTimes26 = [2, 1.860, 2.853, 0.939, 3.192, 1.156];
var futureImages26 = [35, 59, 57, 50, 47, 46];

/* Conversation 27 -- CONFUSION (ACTIVITY 1) / Bottom out Hint */
var futureConversation27 = [
    null,
    "I remember getting stuck trying to make Alonzo move where I wanted him to. We had to play with the X and Y coordinates a lot.",
    null,
    "Our teacher Ms. Diaz told us X is for horizontal movement, and Y is for vertical movement.",
    null
];
var futureSpeaker27 = [null, 'j', null, 'v', null];
var futureAudio27 = [
    null,
    "1_Activity1_Hint_Jeremy.mp3",
    null,
    "2_Activity1_Hint_Viviana.mp3",
    null
];
var audioTimes27 = [2, 3.677, 2.334, 3.405, 2.041];
var futureImages27 = [35, 41, 49, 57, 58];

/* Conversation 28 -- CONFUSION (ACTIVITY 2) / Bottom out Hint */
var futureConversation28 = [
    null,
    "When we did something like this, we didn’t know where to put the forever block. We realized we had to put “Forever” on top of the code, and all the blocks we wanted to loop inside it.",
    null,
    null,
    "Yeah, everything you put inside the Forever block will loop, well… forever!",
    null,
    null
];
var futureSpeaker28 = [null, 'v', null, null, 'j', null, null];
var futureAudio28 = [
    null,
    "1_Activity2_Hint_Viviana.mp3",
    null,
    null,
    "2_Activity2_Hint_Jeremy.mp3",
    null,
    null
];
var audioTimes28 = [2, 3.390, 3.384, 2.768, 0.701, 2.145, 1.228];
var futureImages28 = [35, 7, 58, 57, 50, 37, 49];

/* Conversation 29 -- CONFUSION (ACTIVITY 3) / Bottom out Hint */
var futureConversation29 = [
    null,
    "If-Else was a bit confusing before Ms. Diaz explained it to us. She said: “‘IF’ happens when the condition happens, and ‘ELSE’ happens if the condition does not happen.”",
    null,
    null,
    "Yeah I remember! She said: “For example: Imagine you’re going to soccer practice. IF it’s sunny, you’ll get to play! But ELSE, if it rains, you’ll have to stay home. Either way, one of those two will happen!”",
    null,
    null,
    null,
    null,
    "Hmm. So with these sprites… “IF” should have what happens if the sprites touch. And “ELSE” what should happen when they’re not touching?",
    null,
    null,
    "That’s right!"
];
var futureSpeaker29 = [null, 'v', null, null, 'j', null, null, null, null, 'v', null, null, 'j'];
var futureAudio29 = [
    null,
    "1_Activity3_Hint_Viviana.mp3",
    null,
    null,
    "2_Activity3_Hint_Jeremy.mp3",
    null,
    null,
    null,
    null,
    "3_Activity3_Hint_Viviana.mp3",
    null,
    null,
    "4_Activity3_Hint_Jeremy.mp3"
];
var audioTimes29 = [2, 3.900, 3.670, 3.286, 1.614, 3.184, 2.356, 2.990, 1.797, 2.100, 3.164, 3.303, 0.709];
var futureImages29 = [35, 8, 57, 58, 46, 48, 48, 49, 47, 48, 7, 64, 13, 26];
// End of the agent dialogues, audios, and animations



var subTasks = ['subtask 1: run the code', 'subtask2: review the code and find the bug'];
var subTaskIndex = 0;

var speechRight;
var speechLeft;
var firstInterfaceCreation=true;

var agentPanelTextureArray = [];

// IDE_Morph ///////////////////////////////////////////////////////////

// I am SNAP's top-level frame, the Editor window

// IDE_Morph inherits from Morph:

IDE_Morph.prototype = new Morph();
IDE_Morph.prototype.constructor = IDE_Morph;
IDE_Morph.uber = Morph.prototype;

// IDE_Morph preferences settings and skins



IDE_Morph.prototype.setDefaultDesign = function () {
    MorphicPreferences.isFlat = false;
    SpriteMorph.prototype.paletteColor = new Color(55, 55, 55);
    SpriteMorph.prototype.paletteTextColor = new Color(230, 230, 230);
    StageMorph.prototype.paletteTextColor
        = SpriteMorph.prototype.paletteTextColor;
    StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
    SpriteMorph.prototype.sliderColor
        = SpriteMorph.prototype.paletteColor.lighter(30);

    IDE_Morph.prototype.buttonContrast = 30;
    IDE_Morph.prototype.backgroundColor = new Color(40, 40, 40);
    IDE_Morph.prototype.frameColor = SpriteMorph.prototype.paletteColor;

    IDE_Morph.prototype.groupColor
        = SpriteMorph.prototype.paletteColor.lighter(8);
    IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
    IDE_Morph.prototype.buttonLabelColor = new Color(255, 255, 255);
    IDE_Morph.prototype.tabColors = [
        IDE_Morph.prototype.groupColor.darker(40),
        IDE_Morph.prototype.groupColor.darker(60),
        IDE_Morph.prototype.groupColor
    ];
    IDE_Morph.prototype.rotationStyleColors = IDE_Morph.prototype.tabColors;
    IDE_Morph.prototype.appModeColor = new Color();
    IDE_Morph.prototype.scriptsPaneTexture = this.scriptsTexture();

    // This is the old agent animations
    var files = [
        "./new_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/AreYouReady.png",
        "./WoZ_images/AreYouReady-2.png",
        "./WoZ_images/AreYouReady-3.png",
        "./WoZ_images/AreYouReady-4.png",
        "./WoZ_images/AreYouReady-5.png",
        "./WoZ_images/AreYouReady-6.png",
        "./WoZ_images/Nml_Vivi-Confused-NeutralTalk-EyeS-Hmm_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Confused-NeutralTalk-EyeS-Neck_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Confused-SmileTalk-EyeA-Hmm_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Confused-SmileTalk-EyeS-Hmm_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Confused-SmileTalk-EyeS-IDK_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Confused-SmileTalk-EyeS-IdleH_Jay-Joyful-ToothySmile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Confused-SmileTalk-EyeS-IdleH_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Confused-SmileTalk-EyeS-Neck_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-NeutralTalk-EyeS-Neck_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-Smile-EyeS-Intro_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-SmileTalk-EyeS-2Thumb_Jay-Joyful-ToothySmile-EyeS-2Thumb.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-SmileTalk-EyeS-2Thumb_Jay-Neutral-ToothySmile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-SmileTalk-EyeS-Hmm_Jay-Joyful-ToothySmile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-SmileTalk-EyeS-IDK_Jay-Joyful-ToothySmile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-SmileTalk-EyeS-IdleN_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-SmileTalk-EyeS-Intro_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-SmileTalk-EyeS-Yay_Jay-Joyful-ToothySmile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-SmileTalk-EyeS-Yay_Jay-Joyful-ToothySmile-EyeS-Yay.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-ToothySmile-EyeS-2Thumb_Jay-Joyful-SmileTalk-EyeS-2Thumb.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-ToothySmile-EyeS-IdleN_Jay-Joyful-SmileTalk-EyeS-2Thumb.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-ToothySmile-EyeS-IdleN_Jay-Joyful-SmileTalk-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-ToothySmile-EyeS-IdleN_Jay-Joyful-SmileTalk-EyeS-Yay.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-ToothySmile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-Hmm.jpg",
        "./WoZ_images/Nml_Vivi-Joyful-ToothySmile-EyeS-Yay_Jay-Joyful-SmileTalk-EyeS-Yay.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Doubtful-EyeS-Hmm_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Joyful-SmileTalk-EyeS-Intro.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-NeutralTalk-EyeA-Hmm.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-NeutralTalk-EyeA-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-SmileTalk-EyeA-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-SmileTalk-EyeS-IdleF.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-SmileTalk-EyeS-Intro.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleH_Jay-Joyful-SmileTalk-EyeS-Neck.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Confused-NeutralTalk-EyeS-IdleH.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Confused-NeutralTalk-EyeS-Neck.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Confused-SmileTalk-EyeS-IDK.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Joyful-NeutralTalk-EyeS-Neck.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-NeutralTalk-EyeS-Hmm.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-Hmm.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-IDK.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-IdleF.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-IdleH.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-Smile-EyeS-Perm2Talk_Jay-Neutral-Smile-EyeS-Perm2Talk.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-SmileTalk-EyeA-Fist_Jay-Neutral-Smile-EyeA-Fist.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-SmileTalk-EyeA-IdleN_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-SmileTalk-EyeS-2Thumb_Jay-Neutral-ToothySmile-EyeS-2Thumb.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IDK_Jay-Joyful-ToothySmile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IDK_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IdleF_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IdleH_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IdleN_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-SmileTalk-EyeS-Intro_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-ToothySmile-EyeA-Fist_Jay-Joyful-SmileTalk-EyeA-Fist.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-ToothySmile-EyeS-2Thumb_Jay-Neutral-SmileTalk-EyeS-2Thumb.jpg",
        "./WoZ_images/Nml_Vivi-Neutral-ToothySmile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-2Thumb.jpg",
        "./WoZ_images/Nml_Vivi-Raised-SmileTalk-EyeS-Hmm_Jay-Neutral-ToothySmile-EyeS-IdleN.jpg",
        "./WoZ_images/RoleSwitch.png",
        "./WoZ_images/RoleSwitch-2.png",
        "./WoZ_images/RoleSwitch-3.png",
        "./WoZ_images/RoleSwitch-4.png",
        "./WoZ_images/RoleSwitch-5.png",
        "./WoZ_images/Vign_Vivi-Confused-NeutralTalk-EyeA-Hmm_Jay-Neutral-Doubtful-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Confused-NeutralTalk-EyeA-IDK_Jay-Neutral-Doubtful-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Confused-NeutralTalk-EyeA-IDK_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Confused-NeutralTalk-EyeA-Neck_Jay-Confused-Doubtful-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Confused-SmileTalk-EyeA-Hmm_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Confused-SmileTalk-EyeA-IdleF_Jay-Confused-Doubtful-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Confused-SmileTalk-EyeA-IdleN_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-IDK.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-Neck.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Joyful-NeutralTalk-EyeA-Yay.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Raised-SmileTalk-EyeA-IdleF.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-IDK.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-NeutralTalk-EyeA-Hmm.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-NeutralTalk-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-ToothySmile-EyeA-Hmm.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Raised-SmileTalk-EyeA-IdleF.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-SmileTalk-EyeA-IdleF_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/Vign_Vivi-Neutral-SmileTalk-EyeA-IdleH_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./WoZ_images/TitleCard_1.jpg",
        "./WoZ_images/TitleCard_2.jpg",
        "./WoZ_images/TitleCard_3.jpg",
        "./WoZ_images/SplashArt_HappyDance_wHeadset.jpg",
        "./WoZ_images/SplashArt_HappyDance.jpg",
        "./WoZ_images/SplashArt_TopView_wHeadset.jpg",
        "./WoZ_images/SplashArt_TopView.jpg",
        "./WoZ_images/SplashArt_WeDidIt_wHeadset.jpg",
        "./WoZ_images/SplashArt_WeDidIt.jpg",
        "./WoZ_images/SomeTimeLaterCard.jpg",
        "./WoZ_images/SomeTimeLaterCard-2.jpg",
        "./WoZ_images/SomeTimeLaterCard-3.jpg",
        "./WoZ_images/SomeTimeLaterCard-5.jpg",
        "./WoZ_images/RoleSwitchRequest.png",
        "./WoZ_images/RoleSwitchConfirm.png",
        "./WoZ_images/joinDialogue.jpg"
    ];


    // This is the new agent animations
    var new_files = [
        // "./images/Start_2.png",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-NeutralTalk-EyeA-Hmm.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-SmileTalk-EyeA-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-SmileTalk-EyeA-IdleN_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/Nml_Vivi-Confused-SmileTalk-EyeA-Hmm_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-ToothySmile-EyeA-Fist_Jay-Joyful-SmileTalk-EyeA-Fist.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Joyful-SmileTalk-EyeS-Intro.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-SmileTalk-EyeS-IdleF.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-SmileTalk-EyeS-Intro.jpg",
        "./new_images/Nml_Vivi-Neutral-ToothySmile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-2Thumb.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Raised-SmileTalk-EyeS-Hmm_Jay-Neutral-ToothySmile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Joyful-SmileTalk-EyeS-Intro_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/Nml_Vivi-Joyful-SmileTalk-EyeS-2Thumb_Jay-Neutral-ToothySmile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-SmileTalk-EyeA-Fist_Jay-Neutral-Smile-EyeA-Fist.jpg",
        "./new_images/Nml_Vivi-Neutral-SmileTalk-EyeS-Intro_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Joyful-SmileTalk-EyeS-2Thumb_Jay-Joyful-ToothySmile-EyeS-2Thumb.jpg",
        "./new_images/Nml_Vivi-Joyful-ToothySmile-EyeS-2Thumb_Jay-Joyful-SmileTalk-EyeS-2Thumb.jpg",
        "./new_images/Nml_Vivi-Neutral-ToothySmile-EyeS-2Thumb_Jay-Neutral-SmileTalk-EyeS-2Thumb.jpg",
        "./new_images/Nml_Vivi-Neutral-SmileTalk-EyeS-2Thumb_Jay-Neutral-ToothySmile-EyeS-2Thumb.jpg",
        "./new_images/Nml_Vivi-Joyful-SmileTalk-EyeS-Yay_Jay-Joyful-ToothySmile-EyeS-Yay.jpg",
        "./new_images/Nml_Vivi-Joyful-ToothySmile-EyeS-Yay_Jay-Joyful-SmileTalk-EyeS-Yay.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Joyful-NeutralTalk-EyeS-Neck.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Confused-NeutralTalk-EyeS-IdleH.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Confused-NeutralTalk-EyeS-Neck.jpg",
        "./new_images/Nml_Vivi-Confused-NeutralTalk-EyeS-Neck_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-NeutralTalk-EyeS-Hmm.jpg",
        "./new_images/Nml_Vivi-Confused-SmileTalk-EyeS-Hmm_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Joyful-ToothySmile-EyeS-IdleN_Jay-Joyful-SmileTalk-EyeS-2Thumb.jpg",
        "./new_images/Nml_Vivi-Joyful-ToothySmile-EyeS-IdleN_Jay-Joyful-SmileTalk-EyeS-Yay.jpg",
        "./new_images/Nml_Vivi-Joyful-SmileTalk-EyeS-Hmm_Jay-Joyful-ToothySmile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleH_Jay-Joyful-SmileTalk-EyeS-Neck.jpg",
        "./new_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IdleH_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IdleN_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-NeutralTalk-EyeA-IdleN.jpg",
        "./new_images/Nml_Vivi-Confused-SmileTalk-EyeS-Neck_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Joyful-ToothySmile-EyeS-IdleN_Jay-Joyful-SmileTalk-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Confused-SmileTalk-EyeS-IDK_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IDK_Jay-Joyful-ToothySmile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Joyful-SmileTalk-EyeS-IDK_Jay-Joyful-ToothySmile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-IDK.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-IdleF.jpg",
        "./new_images/Nml_Vivi-Joyful-ToothySmile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-Hmm.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Confused-SmileTalk-EyeS-IDK.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-Hmm.jpg",
        "./new_images/Nml_Vivi-Neutral-Smile-EyeS-IdleN_Jay-Neutral-SmileTalk-EyeS-IdleH.jpg",
        "./new_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IDK_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Neutral-SmileTalk-EyeS-IdleF_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Nml_Vivi-Joyful-NeutralTalk-EyeS-Neck_Jay-Neutral-Smile-EyeS-IdleN.jpg",
        "./new_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-IDK.jpg",
        "./new_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Raised-SmileTalk-EyeA-IdleF.jpg",
        "./new_images/Vign_Vivi-Confused-SmileTalk-EyeA-IdleF_Jay-Confused-Doubtful-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Confused-NeutralTalk-EyeA-IDK_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Confused-SmileTalk-EyeA-IdleN_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Joyful-NeutralTalk-EyeA-Yay.jpg",
        "./new_images/Vign_Vivi-Confused-NeutralTalk-EyeA-IDK_Jay-Neutral-Doubtful-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-Neck.jpg",
        "./new_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-ToothySmile-EyeA-Hmm.jpg",
        "./new_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Confused-NeutralTalk-EyeA-IDK.jpg",
        "./new_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-NeutralTalk-EyeA-Hmm.jpg",
        "./new_images/Vign_Vivi-Neutral-Smile-EyeA-IdleN_Jay-Neutral-NeutralTalk-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Neutral-SmileTalk-EyeA-IdleF_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Neutral-SmileTalk-EyeA-IdleH_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Confused-NeutralTalk-EyeA-Hmm_Jay-Neutral-Doubtful-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Neutral-Doubtful-EyeA-IdleN_Jay-Raised-SmileTalk-EyeA-IdleF.jpg",
        "./new_images/Vign_Vivi-Confused-NeutralTalk-EyeA-Neck_Jay-Confused-Doubtful-EyeA-IdleN.jpg",
        "./new_images/Vign_Vivi-Confused-SmileTalk-EyeA-Hmm_Jay-Neutral-Smile-EyeA-IdleN.jpg",
        "./new_images/TitleCard_1.jpg",
        "./new_images/SplashArt_HappyDance_wHeadset.jpg",
        "./new_images/SplashArt_HappyDance.jpg",
        "./new_images/SplashArt_TopView_wHeadset.jpg",
        "./new_images/SplashArt_TopView.jpg",
        "./new_images/SplashArt_WeDidIt_wHeadset.jpg",
        "./new_images/SplashArt_WeDidIt.jpg",
        "./new_images/SomeTimeLaterCard.jpg",
        "./new_images/TitleCard_2.jpg",
        "./new_images/TitleCard_3.jpg",
        "./new_images/RoleSwitchRequest.png",
        "./new_images/RoleSwitchConfirm.png",
        "./new_images/joinDialogue.jpg"
    ];

    for (i = 0; i < files.length; i++) {
        agentPanelTextureArray.push(IDE_Morph.prototype.agentPanelTexture = this.agentTexture(files[i]));

        //IDE_Morph.prototype.agentPanelTexture);
    }


    IDE_Morph.prototype.padding = 5;

    SpriteIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    CostumeIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SoundIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    TurtleIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
};

IDE_Morph.prototype.setFlatDesign = function () {
    MorphicPreferences.isFlat = true;
    SpriteMorph.prototype.paletteColor = new Color(255, 255, 255);
    SpriteMorph.prototype.paletteTextColor = new Color(70, 70, 70);
    StageMorph.prototype.paletteTextColor
        = SpriteMorph.prototype.paletteTextColor;
    StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
    SpriteMorph.prototype.sliderColor = SpriteMorph.prototype.paletteColor;

    IDE_Morph.prototype.buttonContrast = 30;
    IDE_Morph.prototype.backgroundColor = new Color(200, 200, 200);
    IDE_Morph.prototype.frameColor = new Color(255, 255, 255);

    IDE_Morph.prototype.groupColor = new Color(230, 230, 230);
    IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
    IDE_Morph.prototype.buttonLabelColor = new Color(70, 70, 70);
    IDE_Morph.prototype.tabColors = [
        IDE_Morph.prototype.groupColor.lighter(60),
        IDE_Morph.prototype.groupColor.darker(10),
        IDE_Morph.prototype.groupColor
    ];
    IDE_Morph.prototype.rotationStyleColors = [
        IDE_Morph.prototype.groupColor,
        IDE_Morph.prototype.groupColor.darker(10),
        IDE_Morph.prototype.groupColor.darker(30)
    ];
    IDE_Morph.prototype.appModeColor = IDE_Morph.prototype.frameColor;
    IDE_Morph.prototype.scriptsPaneTexture = null;
    IDE_Morph.prototype.padding = 1;

    SpriteIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    CostumeIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SoundIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    TurtleIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
};

/*
    NEED TO FIGURE OUT HOW TO MAKE N OF THESE
    this.agent7 = this.resourceURL('/images/Nml_Jeyesclosed_Jopensmile_Jintrobody.jpg');
    this.agent8 = this.resourceURL('/images/Nml_Jeyestostudent_Jopensmile_Jfingerup.jpg');
    this.agent9 = this.resourceURL('/images/Nml_Jeyestostudent_Jopensmile_Jintrobody.jpg');
    this.agent10 = this.resourceURL('/images/Nml_Jeyestostudent_Jopensmile_Jthumbsup.jpg');
    this.agent11 = this.resourceURL('/images/Nml_JVeyestostudent_closedsmile_neutralbody.jpg');
    this.agent12 = this.resourceURL('/images/Nml_JVeyestostudent_Vopensmile_Vthoughtful.jpg');
    this.agent13 = this.resourceURL('/images/Nml_Veyesclosed_Vopensmile_Vintrobody.jpg');
    this.agent14 = this.resourceURL('/images/Nml_Veyesclosed_Vopensmile_Vthumbsup.jpg');
    this.agent15 = this.resourceURL('/images/Nml_VeyestoJ_Vopensmile_Vfistbump.jpg');
    this.agent16 = this.resourceURL('/images/Nml_Veyestostudent_Vopensmile_Vintrobody.jpg');
*/

IDE_Morph.prototype.agentTexture = function (imageSrc) {
    var pic = newCanvas(new Point(480, 360)), // bigger scales faster
        ctx = pic.getContext('2d'),
        i;

    var image = new Image();

    image.onload = function () {
        ctx.drawImage(image,0,0,480,360);
    };
    image.src=imageSrc;

    return pic;
};

IDE_Morph.prototype.scriptsTexture = function () {
    var pic = newCanvas(new Point(100, 100)), // bigger scales faster
        ctx = pic.getContext('2d'),
        i;
    for (i = 0; i < 100; i += 4) {
        ctx.fillStyle = this.frameColor.toString();
        ctx.fillRect(i, 0, 1, 100);
        ctx.fillStyle = this.groupColor.lighter(6).toString();
        ctx.fillRect(i + 1, 0, 1, 100);
        ctx.fillRect(i + 3, 0, 1, 100);
        ctx.fillStyle = this.groupColor.toString();
        ctx.fillRect(i + 2, 0, 1, 100);
    }
    return pic;
};

IDE_Morph.prototype.setDefaultDesign();

// IDE_Morph instance creation:

function IDE_Morph(isAutoFill) {
    this.init(isAutoFill);
}

IDE_Morph.prototype.init = function (isAutoFill) {
    // global font setting
    MorphicPreferences.globalFontFamily = 'Helvetica, Arial';

    // restore saved user preferences
    this.userLanguage = null; // user language preference for startup
    this.projectsInURLs = false;
    this.applySavedSettings();

    // additional properties:
    this.cloudMsg = null;
    this.source = 'local';
    this.serializer = new SnapSerializer();
    this.globalVariables = new VariableFrame();
    this.currentSprite = new SpriteMorph(this.globalVariables);
    this.sprites = new List([this.currentSprite]);
    this.currentCategory = 'motion';
    this.currentTab = 'scripts';
    this.projectName = '';
    this.projectNotes = '';

    this.logoURL = this.resourceURL('snap_logo_sm.png');
    this.logo = null;
    this.agentImage = null;
    this.agentImageURL = this.resourceURL('./images/Nml_EyesToEachOther_Idle.jpg');
    this.controlBar = null;
    this.categories = null;
    this.palette = null;
    this.paletteHandle = null;
    this.spriteBar = null;
    this.spriteEditor = null;
    this.stage = null;
    this.stageHandle = null;
    this.corralBar = null;
    this.corral = null;
    this.agentPanel = null;
    this.agentControllerBar = null;
    this.speechBubblePanel = null;

    this.isAutoFill = isAutoFill === undefined ? true : isAutoFill;
    this.isAppMode = false;
    this.isReplayMode = false;
    this.preReplayUndoState = null;
    this.isSmallStage = false;
    this.isLargeAgent = false;
    this.isOriginalAgent = true;
    this.filePicker = null;
    this.hasChangedMedia = false;

    this.isAnimating = true;
    this.paletteWidth = 200; // initially same as logo width
    this.stageRatio = 1; // for IDE animations, e.g. when zooming

    this.wasSingleStepping = false; // for toggling to and from app mode
    this.loadNewProject = false; // flag when starting up translated
    this.shield = null;

    this.savingPreferences = true; // for bh's infamous "Eisenbergification"

    // initialize inherited properties:
    IDE_Morph.uber.init.call(this);

    // override inherited properites:
    this.color = this.backgroundColor;
    this.activeEditor = this;
};

IDE_Morph.prototype.openIn = function (world) {
    var usr, myself = this, urlLanguage = null;

    // get persistent user data, if any
    if (localStorage) {
        usr = localStorage['-snap-user'];
        if (usr) {
            usr = SnapCloud.parseSnapResponse(usr)[0];
            if (usr) {
                SnapCloud.username = usr.username || null;
                SnapCloud.password = usr.password || null;
                if (SnapCloud.username) {
                    this.source = 'cloud';
                }
            }
        }
    }

    this.buildPanes();
    SnapActions.configure(this);
    SnapActions.disableCollaboration();
    SnapUndo.reset();
    world.add(this);
    world.userMenu = this.userMenu;

    // override SnapCloud's user message with Morphic
    SnapCloud.message = function (string) {
        var m = new MenuMorph(null, string),
            intervalHandle;
        m.popUpCenteredInWorld(world);
        intervalHandle = setInterval(function () {
            m.destroy();
            clearInterval(intervalHandle);
        }, 2000);
    };

    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = function (morph) {
        if (!(morph instanceof DialogBoxMorph)) {
            if (world.hand.grabOrigin) {
                morph.slideBackTo(world.hand.grabOrigin);
            } else {
                world.hand.grab(morph);
            }
        }
    };

    this.reactToWorldResize(world.bounds);

    // dynamic notifications from non-source text files
    // has some issues, commented out for now
    /*
    this.cloudMsg = getURL('http://snap.berkeley.edu/cloudmsg.txt');
    motd = getURL('http://snap.berkeley.edu/motd.txt');
    if (motd) {
        this.inform('Snap!', motd);
    }
    */

    if (this.userLanguage) {
        this.loadNewProject = true;
        this.setLanguage(this.userLanguage, this.interpretUrlAnchors);
    } else {
        this.interpretUrlAnchors();
    }
    window.dispatchEvent(new CustomEvent("ideLoaded"));
};

// IDE_Morph.prototype.interpretUrlAnchors = function (loc) {
//     console.log("IDE_Morph.prototype.interpretUrlAnchors");
//     var myself = this,
//         urlLanguage,
//         hash,
//         dict,
//         idx;

//     loc = loc || location;
//     function getURL(url) {
//         try {
//             return utils.getUrlSync(url);
//         } catch (err) {
//             myself.showMessage('unable to retrieve project');
//             return '';
//         }
//     }

//     function applyFlags(dict) {
//         if (dict.editMode) {
//             myself.toggleAppMode(false);
//         } else {
//             myself.toggleAppMode(true);
//         }
//         if (!dict.noRun) {
//             myself.runScripts();
//         }
//         if (dict.hideControls) {
//             myself.controlBar.hide();
//             window.onbeforeunload = nop;
//         }
//         if (dict.noExitWarning) {
//             window.onbeforeunload = nop;
//         }
//     }

//     dict = {};
//     if (loc.href.indexOf('?') > -1) {
//         var querystring = loc.href
//             .replace(/^.*\?/, '')
//             .replace('#' + loc.hash, '');

//         dict = SnapCloud.parseDict(querystring);
//     }

//     if (loc.hash.substr(0, 6) === '#open:') {
//         hash = loc.hash.substr(6);
//         if (hash.charAt(0) === '%'
//             || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
//             hash = decodeURIComponent(hash);
//         }
//         if (contains(
//             ['project', 'blocks', 'sprites', 'snapdata'].map(
//                 function (each) {
//                     return hash.substr(0, 8).indexOf(each);
//                 }
//             ),
//             1
//         )) {
//             this.droppedText(hash);
//         } else {
//             this.droppedText(getURL(hash));
//         }
//     } else if (loc.hash.substr(0, 5) === '#run:') {
//         hash = loc.hash.substr(5);
//         idx = hash.indexOf("&");
//         if (idx > 0) {
//             hash = hash.slice(0, idx);
//         }
//         if (hash.charAt(0) === '%'
//             || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
//             hash = decodeURIComponent(hash);
//         }
//         if (hash.substr(0, 8) === '<project>') {
//             SnapActions.openProject(hash);
//         } else {
//             SnapActions.openProject(getURL(hash));
//         }
//         this.toggleAppMode(true);
//         this.runScripts();

//     } else if (loc.hash.substr(0, 9) === '#present:' || dict.action === 'present') {
//         myself.showMessage('Fetching project...');
//         // code block for choosing dialogues from different activities
//         activity_name = JSON.stringify(dict.ProjectName).substring(5,14);
//         user_name = JSON.stringify(dict.Username)
//         console.log("The username is: " + user_name);
//         console.log(dict.ProjectName);
//         console.log(JSON.stringify(dict.ProjectName));
//         console.log(activity_name);

//         var name = dict ? dict.ProjectName : loc.hash.substr(9),
//             isLoggedIn = SnapCloud.username !== null;

//         if (!isLoggedIn) {
//             myself.showMessage('You are not logged in. Cannot open ' + name);
//             SnapCloud.reconnect() // I added this.
//             return;
//         }

//         console.log("dict: "+ JSON.stringify(dict))
        
//         // if ((dict.Username).length>3) {    
//         if ((dict.Username).length>3 && ((dict.Username).substr(0,3) == (dict.ProjectName).substr(0,3))) {  
//             console.log("-- This is a public project and the user is a collaborator.")
          
//             projectUsername = (SnapCloud.username).substr(0,3)    
//             SnapCloud.getProjectId(
//             projectUsername,
//             dict.ProjectName,
//             function (ID) {
//                 var projectID = Object.keys(ID)[0]
//                 // console.log(projectID)

//                 myself.nextSteps([
//                     function () {nop(); }, // yield (bug in Chrome)
//                     function () {
//                         SnapCloud.joinActiveProject(        
//                                 projectID,
//                                 function(xml) {
//                                     // console.log("xml1: " + JSON.stringify(xml))
//                                     var action = myself.rawLoadCloudProject(xml, "true");      
    
//                                     if (action) {
//                                                 action.then(function() {
//                                                     applyFlags(dict);
//                                                 });
//                                             } else {
//                                                 applyFlags(dict);
//                                             }
//                                 },
//                                 myself.cloudError()
//                         );
//                     }
//                 ]);
//             },
//             myself.cloudError()
//         );
//         } 
//         else if ((dict.Username).length=3 && ((dict.Username).substr(0,3) == (dict.ProjectName).substr(0,3))) {
//             console.log("-- This is a public project saved to the user's account. When student saves the project, it is automatically saved to the user's account on the cloud.")
//             myself.nextSteps([
//                 function () {
//                     msg = myself.showMessage('Opening ' + name);     
//                 },
//                 function () {nop(); }, // yield (bug in Chrome)
//                 function () {
//                     SnapCloud.getProjectByName(
//                         SnapCloud.username,
//                         dict.ProjectName,
//                         function (xml) {
//                             msg.destroy();
//                             var action = myself.rawLoadCloudProject(xml);
//                             // console.log('-----action: '+JSON.stringify(action))
                            
//                             location.hash = '?action=present&Username=' +
//                                 encodeURIComponent(SnapCloud.username) +
//                                 '&ProjectName=' +
//                                 encodeURIComponent(dict.ProjectName);
//                             console.log("5encodeURIComponent: "+JSON.stringify(location.hash))
                            
//                             if (action) {
//                                 action.then(function() {
//                                     applyFlags(dict);
//                                 });
//                             } else {
//                                 applyFlags(dict);
//                             }
//                         },
//                         myself.cloudError()
//                     );
//                 }
//             ]);
//         }
//         else {
//             console.log("-- This is a public project and it is not saved to the user's account. When student saves the project, it is saved to the user's browser.")

//             this.shield = new Morph();
//             this.shield.color = this.color;
//             this.shield.setExtent(this.parent.extent());
//             this.parent.add(this.shield);
//             myself.showMessage('Fetching project\nfrom the cloud...');

//             if (loc.hash.substr(0, 9) === '#present:') {
//                 dict = SnapCloud.parseDict(loc.hash.substr(9));
//             }

//             SnapCloud.getPublicProject(
//                 SnapCloud.encodeDict(dict),
//                 function (projectData) {
//                     var msg;
//                     myself.nextSteps([
//                         function () {
//                             msg = myself.showMessage('Opening project...');
//                         },
//                         function () {nop(); }, // yield (bug in Chrome)
//                         function () {
//                             var action = myself.droppedText(projectData);
//                             if (action) {
//                                 action.then(function () {
//                                     myself.hasChangedMedia = true;
//                                     myself.shield.destroy();
//                                     myself.shield = null;
//                                     msg.destroy();
//                                     applyFlags(dict);
//                                 });
//                             }
//                         }
//                     ]);
//                 },
//                 this.cloudError()
//             );
//         }

//     } else if (loc.hash.substr(0, 7) === '#cloud:') {
//         this.shield = new Morph();
//         this.shield.alpha = 0;
//         this.shield.setExtent(this.parent.extent());
//         this.parent.add(this.shield);
//         myself.showMessage('Fetching project\nfrom the cloud...');

//         // make sure to lowercase the username
//         dict = SnapCloud.parseDict(loc.hash.substr(7));
//         dict.Username = dict.Username.toLowerCase();

//         SnapCloud.getPublicProject(
//             SnapCloud.encodeDict(dict),
//             function (projectData) {
//                 var msg;
//                 myself.nextSteps([
//                     function () {
//                         msg = myself.showMessage('Opening project...');
//                     },
//                     function () {nop(); }, // yield (bug in Chrome)
//                     function () {
//                         var action = SnapActions.openProject(projectData);
//                         action.then(function() {
//                             myself.hasChangedMedia = true;
//                             myself.shield.destroy();
//                             myself.shield = null;
//                             msg.destroy();
//                             myself.toggleAppMode(false);
//                         });
//                     }
//                 ]);
//             },
//             this.cloudError()
//         );
//     } else if (loc.hash.substr(0, 4) === '#dl:') {
//         myself.showMessage('Fetching project\nfrom the cloud...');

//         // make sure to lowercase the username
//         dict = SnapCloud.parseDict(loc.hash.substr(4));
//         dict.Username = dict.Username.toLowerCase();

//         SnapCloud.getPublicProject(
//             SnapCloud.encodeDict(dict),
//             function (projectData) {
//                 window.open('data:text/xml,' + projectData);
//             },
//             this.cloudError()
//         );
//     } else if (loc.hash.substr(0, 6) === '#lang:') {
//         urlLanguage = loc.hash.substr(6);
//         this.setLanguage(urlLanguage);
//         this.loadNewProject = true;
//     } else if (loc.hash.substr(0, 7) === '#signup') {
//         this.createCloudAccount();
//     } else if (loc.hash.substr(0, 12) === '#collaborate') {
//         var sessionId = loc.hash.substr(13);
//         // Get the session id and join it!
//         SnapActions.enableCollaboration();
//         SnapActions.joinSession(sessionId, this.cloudError());
//     } else if (loc.hash.substr(0, 9) === '#example:' || dict.action === 'example') {
//         var example = dict ? dict.ProjectName : loc.hash.substr(9),
//             msg;

//         this.shield = new Morph();
//         this.shield.alpha = 0;
//         this.shield.setExtent(this.parent.extent());
//         this.parent.add(this.shield);

//         var projectData = myself.getURL(myself.resourceURL('Examples', example));

//         myself.nextSteps([
//             function () {
//                 msg = myself.showMessage('Opening ' + example + ' example...');
//             },
//             function () {nop(); }, // yield (bug in Chrome)
//             function () {
//                 var action = myself.droppedText(projectData);
//                 if (action) {
//                     action.then(function () {
//                         myself.hasChangedMedia = true;
//                         if (myself.shield) {
//                             myself.shield.destroy();
//                             myself.shield = null;
//                         }
//                         msg.destroy();
//                         applyFlags(dict);
//                     });
//                 }
//             }
//         ]);
//     } else if (loc.hash.substr(0, 9) === '#private:' || dict.action === 'private') {
//         var name = dict ? dict.ProjectName : loc.hash.substr(9),
//             isLoggedIn = SnapCloud.username !== null;

//         if (!isLoggedIn) {
//             myself.showMessage('You are not logged in. Cannot open ' + name);
//             return;
//         }

//         myself.nextSteps([
//             function () {
//                 msg = myself.showMessage('Opening ' + name + ' example...');
//             },
//             function () {nop(); }, // yield (bug in Chrome)
//             function () {
//                 // This needs to be able to open a project by name, too
//                 // TODO: FIXME
//                 SnapCloud.getProjectByName(
//                     SnapCloud.username,
//                     dict.ProjectName,
//                     function (xml) {
//                         msg.destroy();
//                         var action = myself.rawLoadCloudProject(xml);
//                         if (action) {
//                             action.then(function() {
//                                 applyFlags(dict);
//                             });
//                         } else {
//                             applyFlags(dict);
//                         }
//                     },
//                     myself.cloudError()
//                 );
//             }
//         ]);

//     } else {
//         myself.newProject();
//     }
// };


// IDE_Morph construction
var activity_name;
IDE_Morph.prototype.interpretUrlAnchors = function (loc) {

    console.log("IDE_Morph.prototype.interpretUrlAnchors");
    
    var stateofSwitchRoles;
    
    console.log("Calling switchRole function")
    setTimeout(function(){
        console.log("stateofSwitchRoles: ", stateofSwitchRoles)
        if ((stateofSwitchRoles != 1) && ((activity_name == "activity1") || (activity_name != null))){ 
                     
            console.log("In  setTimeout(function()")
            myself.switchRoles();  
        }      
       }, 900000);

    var myself = this,
        urlLanguage,
        hash,
        dict,
        idx;

    loc = loc || location;
    function getURL(url) {
        try {
            return utils.getUrlSync(url);
        } catch (err) {
            myself.showMessage('unable to retrieve project');
            return '';
        }
    }

    function applyFlags(dict) {
        if (dict.editMode) {
            myself.toggleAppMode(false);
        } else {
            myself.toggleAppMode(true);
        }
        if (!dict.noRun) {
            myself.runScripts();
        }
        if (dict.hideControls) {
            myself.controlBar.hide();
            window.onbeforeunload = nop;
        }
        if (dict.noExitWarning) {
            window.onbeforeunload = nop;
        }
    }

    dict = {};
    if (loc.href.indexOf('?') > -1) {
        var querystring = loc.href
            .replace(/^.*\?/, '')
            .replace('#' + loc.hash, '');

        dict = SnapCloud.parseDict(querystring);
    }

    console.log("NetsbloxURL: ", loc.href);
    console.log("dict", dict); 

    console.log("    Username: ", dict.Username, '\n',
                "Facilitator: ", dict.Facilitator, '\n',
                "ProjectName: ", dict.ProjectName, '\n',
                "ProjectID:", dict.ProjectID, '\n',
                "action: ", dict.action, '\n',
                "    "
    )

    async function callIntervention(aURL) {
        console.log("test: ", aURL)
        const response = await fetch(aURL, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "http://flecks.csc.ncsu.edu", // update to match the domain you will make the request from
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            }   
        })
        .then(async res => {
            var response = await res.json();
            return response;

        })
        .then( async response => {
            console.log("Wizard JSON: ", response);
            console.log("Response from Wizard: ", response.vignette);
            console.log("Response from Wizard: ", response.status);


            if (response.vignette == "confusion-confusion-about-objective"){
                
                intervention = true;
                if (activity_name == "activity2"){
                    interventionNumber = 1;
                }
                else if (activity_name == "activity3"){
                    interventionNumber = 2;
                }
                else if (activity_name == "activity4"){
                    interventionNumber = 3;
                }
                else{
                    console.log("Invalid Activity Number!");
                }
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            } 
            else if (response.vignette == "confusion-floundering"){
                intervention = true;
                interventionNumber = 4;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "confusion-bottom-out-hint"){
                intervention = true;
                if (activity_name == "activity2"){
                    interventionNumber = 5;
                }
                else if (activity_name == "activity3"){
                    interventionNumber = 6;
                }
                else if (activity_name == "activity4"){
                    interventionNumber = 7;
                }
                else{
                    console.log("Invalid Activity Number!");
                }
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "inactivity-inactive-coding"){
                intervention = true;
                interventionNumber = 8;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "inactivity-inactive-talking"){
                intervention = true;
                interventionNumber = 9;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "inactivity-distraction"){
                intervention = true;
                interventionNumber = 10;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "good-teamwork-asking-why-questions"){
                intervention = true;
                interventionNumber = 11;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "good-teamwork-sharing-ideas"){
                intervention = true;
                interventionNumber = 12;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "good-teamwork-listening-to-each-other"){
                intervention = true;
                interventionNumber = 13;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "conflict-not-asking-why-questions"){
                intervention = true;
                interventionNumber = 14;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "conflict-not-sharing-ideas"){
                intervention = true;
                interventionNumber = 15;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }
            else if (response.vignette == "conflict-not-listening-to-each-other"){
                intervention = true;
                interventionNumber = 16;
                // SnapActions.restartAgent();
                myself.joinIntervention();
                console.log("interventionNumber: ", interventionNumber);
            }

            else if (response.vignette == "switch-roles"){
                myself.switchRoles();     
                stateofSwitchRoles = 1
                console.log("switchRoles notification");
            }

            else{
                console.log("Invalid response vignette!");
            } 
        })
        .catch(err => console.log(err));
    }

    if (loc.hash.substr(0, 6) === '#open:') {
        hash = loc.hash.substr(6);
        if (hash.charAt(0) === '%'
            || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
            hash = decodeURIComponent(hash);
        }
        if (contains(
            ['project', 'blocks', 'sprites', 'snapdata'].map(
                function (each) {
                    return hash.substr(0, 8).indexOf(each);
                }
            ),
            1
        )) {
            this.droppedText(hash);
        } else {
            this.droppedText(getURL(hash));
        }
    } else if (loc.hash.substr(0, 5) === '#run:') {
        hash = loc.hash.substr(5);
        idx = hash.indexOf("&");
        if (idx > 0) {
            hash = hash.slice(0, idx);
        }
        if (hash.charAt(0) === '%'
            || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
            hash = decodeURIComponent(hash);
        }
        if (hash.substr(0, 8) === '<project>') {
            SnapActions.openProject(hash);
        } else {
            SnapActions.openProject(getURL(hash));
        }
        this.toggleAppMode(true);
        this.runScripts();

    } else if (loc.hash.substr(0, 9) === '#present:' || dict.action === 'present') {
        console.log("In Present")  
        myself.showMessage('Fetching project...');

        // console.log("dict: "+ JSON.stringify(dict))        
        // console.log("dict.ProjectName: "+ JSON.stringify(dict.ProjectName))
        
            ProjName = (JSON.stringify(dict.ProjectName)).toLowerCase();
            if (ProjName.includes("activity")){
                console.log("-----ProjName includes activity ")
                let index1=ProjName.indexOf("activity")
                activity_name = "activity"+ProjName[index1+8]
                console.log("-----activity_name:",activity_name)
            }
            else{
                activity_name == "activity0"
            }

        user_name = JSON.stringify(dict.Username)

    // --- End Receiving wizard message every 10 sec

        if (activity_name == null){
            console.log("Activity name undefined or 0: Skip calling the API")
        } 
        else {
            setInterval(function(){ 
                console.log("Calling setInterval");
                // Loading env to the client on Node.js is messy so instead we are using a simpler way
    
                let addressURL = "";
                if ((loc.href).includes("localhost")){
                    addressURL = "http://localhost:8888";
                } else {
                    addressURL = "https://flecks.csc.ncsu.edu";
                }
                // console.log("addressURL: ", addressURL)
                
                var callFacilitatorAPIURL = addressURL + "/api/wizard/facilitator/" + dict.Facilitator + "/activity/"+dict.ProjectID
                // console.log("callFacilitatorAPIURL: ", callFacilitatorAPIURL)
                callIntervention(callFacilitatorAPIURL) 
    
            }, 5000);
        }
    
    // --- End Receiving wizard message every 10 sec


        var name = dict ? dict.ProjectName : loc.hash.substr(9),
            isLoggedIn = SnapCloud.username !== null;

        if (!isLoggedIn) {
            myself.showMessage('You are not logged in. Cannot open ' + name);
            SnapCloud.reconnect() // I added this.
            return;
        }
    
        // Activity 2,3,4 
        if ((dict.Facilitator!==undefined) && (SnapCloud.username !==(dict.Facilitator))) 
        {
            console.log("-- Owner: facilitator. Collaborator: student. Student opens the project.")

            projectUsername = dict.Facilitator    
            console.log("projectUsername: ", projectUsername)
            SnapCloud.getProjectId(
                projectUsername,
                dict.ProjectName,
                function (ID) {
                    var projectID = Object.keys(ID)[0]
                    myself.nextSteps([
                        function () {nop(); }, // yield (bug in Chrome)
                        function () {
                            SnapCloud.joinActiveProject(        
                                    projectID,
                                    function(xml) {
                                        // console.log("xml1: " + JSON.stringify(xml))
                                        var action = myself.rawLoadCloudProject(xml, "true");      
        
                                        if (action) {
                                                    action.then(function() {
                                                        applyFlags(dict);
                                                    });
                                                } else {
                                                    applyFlags(dict);
                                                }
                                    },
                                    myself.cloudError()
                            );
                        }
                    ]);
                },
                myself.cloudError()
            );
        } 

        else if (SnapCloud.username ==(dict.Username)) {
            console.log("-- Opening own project ")

            myself.nextSteps([
                function () {
                    msg = myself.showMessage('Opening ' + name);     
                },
                function () {nop(); }, // yield (bug in Chrome)
                function () {
                    SnapCloud.getProjectByName(
                        SnapCloud.username,
                        dict.ProjectName,
                        function (xml) {
                            msg.destroy();
                            var action = myself.rawLoadCloudProject(xml);
                            // console.log('-----action: '+JSON.stringify(action))
                            
                            location.hash = '?action=present&Username=' +
                                encodeURIComponent(SnapCloud.username) +
                                '&ProjectName=' +
                                encodeURIComponent(dict.ProjectName);
                            console.log("5encodeURIComponent: "+JSON.stringify(location.hash))
                            
                            if (action) {
                                action.then(function() {
                                    applyFlags(dict);
                                });
                            } else {
                                applyFlags(dict);
                            }
                        },
                        myself.cloudError()
                    );
                }
            ]);
        }

        else {
            console.log("-- This is a public project and it is not saved to the user's account. When student saves the project, it is saved to the user's browser.")

            this.shield = new Morph();
            this.shield.color = this.color;
            this.shield.setExtent(this.parent.extent());
            this.parent.add(this.shield);
            myself.showMessage('Fetching project\nfrom the cloud...');

            if (loc.hash.substr(0, 9) === '#present:') {
                dict = SnapCloud.parseDict(loc.hash.substr(9));
            }

            SnapCloud.getPublicProject(
                SnapCloud.encodeDict(dict),
                function (projectData) {
                    var msg;
                    myself.nextSteps([
                        function () {
                            msg = myself.showMessage('Opening project...');
                        },
                        function () {nop(); }, // yield (bug in Chrome)
                        function () {
                            var action = myself.droppedText(projectData);
                            if (action) {
                                action.then(function () {
                                    myself.hasChangedMedia = true;
                                    myself.shield.destroy();
                                    myself.shield = null;
                                    msg.destroy();
                                    applyFlags(dict);
                                });
                            }
                        }
                    ]);
                },
                this.cloudError()
            );
        }

    } else if (loc.hash.substr(0, 7) === '#cloud:') {
        this.shield = new Morph();
        this.shield.alpha = 0;
        this.shield.setExtent(this.parent.extent());
        this.parent.add(this.shield);
        myself.showMessage('Fetching project\nfrom the cloud...');

        // make sure to lowercase the username
        dict = SnapCloud.parseDict(loc.hash.substr(7));
        dict.Username = dict.Username.toLowerCase();

        SnapCloud.getPublicProject(
            SnapCloud.encodeDict(dict),
            function (projectData) {
                var msg;
                myself.nextSteps([
                    function () {
                        msg = myself.showMessage('Opening project...');
                    },
                    function () {nop(); }, // yield (bug in Chrome)
                    function () {
                        var action = SnapActions.openProject(projectData);
                        action.then(function() {
                            myself.hasChangedMedia = true;
                            myself.shield.destroy();
                            myself.shield = null;
                            msg.destroy();
                            myself.toggleAppMode(false);
                        });
                    }
                ]);
            },
            this.cloudError()
        );
    } else if (loc.hash.substr(0, 4) === '#dl:') {
        myself.showMessage('Fetching project\nfrom the cloud...');

        // make sure to lowercase the username
        dict = SnapCloud.parseDict(loc.hash.substr(4));
        dict.Username = dict.Username.toLowerCase();

        SnapCloud.getPublicProject(
            SnapCloud.encodeDict(dict),
            function (projectData) {
                window.open('data:text/xml,' + projectData);
            },
            this.cloudError()
        );
    } else if (loc.hash.substr(0, 6) === '#lang:') {
        urlLanguage = loc.hash.substr(6);
        this.setLanguage(urlLanguage);
        this.loadNewProject = true;
    } else if (loc.hash.substr(0, 7) === '#signup') {
        this.createCloudAccount();
    } else if (loc.hash.substr(0, 12) === '#collaborate') {
        var sessionId = loc.hash.substr(13);
        // Get the session id and join it!
        SnapActions.enableCollaboration();
        SnapActions.joinSession(sessionId, this.cloudError());
    } else if (loc.hash.substr(0, 9) === '#example:' || dict.action === 'example') {
        var example = dict ? dict.ProjectName : loc.hash.substr(9),
            msg;

        this.shield = new Morph();
        this.shield.alpha = 0;
        this.shield.setExtent(this.parent.extent());
        this.parent.add(this.shield);

        var projectData = myself.getURL(myself.resourceURL('Examples', example));

        myself.nextSteps([
            function () {
                msg = myself.showMessage('Opening ' + example + ' example...');
            },
            function () {nop(); }, // yield (bug in Chrome)
            function () {
                var action = myself.droppedText(projectData);
                if (action) {
                    action.then(function () {
                        myself.hasChangedMedia = true;
                        if (myself.shield) {
                            myself.shield.destroy();
                            myself.shield = null;
                        }
                        msg.destroy();
                        applyFlags(dict);
                    });
                }
            }
        ]);
    } else if (loc.hash.substr(0, 9) === '#private:' || dict.action === 'private') {
        var name = dict ? dict.ProjectName : loc.hash.substr(9),
            isLoggedIn = SnapCloud.username !== null;

        if (!isLoggedIn) {
            myself.showMessage('You are not logged in. Cannot open ' + name);
            return;
        }

        myself.nextSteps([
            function () {
                msg = myself.showMessage('Opening ' + name + ' example...');
            },
            function () {nop(); }, // yield (bug in Chrome)
            function () {
                // This needs to be able to open a project by name, too
                // TODO: FIXME
                SnapCloud.getProjectByName(
                    SnapCloud.username,
                    dict.ProjectName,
                    function (xml) {
                        msg.destroy();
                        var action = myself.rawLoadCloudProject(xml);
                        if (action) {
                            action.then(function() {
                                applyFlags(dict);
                            });
                        } else {
                            applyFlags(dict);
                        }
                    },
                    myself.cloudError()
                );
            }
        ]);

    } else {
        myself.newProject();
    }

};


IDE_Morph.prototype.buildPanes = function () {
    this.createLogo();
    this.createControlBar();
    this.createCategories();
    this.createPalette();
    this.createStage();
    this.createSpriteBar();
    this.createSpriteEditor();
    this.createCorralBar();
    this.createCorral();
    this.createReplayControls();
};

IDE_Morph.prototype.createLogo = function () {
    var myself = this;

    if (this.logo) {
        this.logo.destroy();
    }

    this.logo = new Morph();
    this.logo.texture = this.resourceURL('snap_logo_sm.png');
    this.logo.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d'),
            gradient = context.createLinearGradient(
                0,
                0,
                this.width(),
                0
            );
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(0.5, myself.frameColor.toString());
        context.fillStyle = MorphicPreferences.isFlat ?
            myself.frameColor.toString() : gradient;
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    this.logo.drawCachedTexture = function () {
        var context = this.image.getContext('2d');
        context.drawImage(
            this.cachedTexture,
            5,
            Math.round((this.height() - this.cachedTexture.height) / 2)
        );
        this.changed();
    };

    this.logo.mouseClickLeft = function () {
        myself.snapMenu();
    };

    this.logo.color = new Color();
    this.logo.setExtent(new Point(200, 28)); // dimensions are fixed
    this.add(this.logo);
};

IDE_Morph.prototype.mouseClickLeft = function () {
    this.setActiveEditor();
};

IDE_Morph.prototype.setActiveEditor = function (dialog) {
    if (this.activeEditor === dialog) {
        return;
    }

    this.activeEditor.onUnsetActive();
    this.activeEditor = dialog || this;
    this.activeEditor.onSetActive();
};

IDE_Morph.prototype.onSetActive = function () {
    if (this.isAppMode) {
        this.spriteEditor.hide();
    } else {
        if (this.currentTab === 'scripts') {
            this.currentSprite.scripts.updateUndoControls();
        } else if (this.spriteEditor.updateUndoControls) {
            this.spriteEditor.updateUndoControls();
        }
    }
};

IDE_Morph.prototype.onUnsetActive = function () {
    if (this.currentTab === 'scripts') {
        this.currentSprite.scripts.hideUndoControls();
    } else if (this.spriteEditor.hideUndoControls) {
        this.spriteEditor.hideUndoControls();
    }
};

IDE_Morph.prototype.getActiveScripts = function () {
    if (this.activeEditor instanceof BlockEditorMorph) {
        return this.activeEditor.body.contents;
    }
    return this.currentSprite.scripts;
};

IDE_Morph.prototype.getActiveEntity = function () {
    // Return the entity which is the subject of the focus. If a block editor
    // is open, return the definition which is being edited, else return the
    // sprite being edited

    if (this.activeEditor instanceof BlockEditorMorph) {
        return this.activeEditor.definition.id + '/scripts';
    }
    return this.currentSprite.id + '/' + this.currentTab;
};

IDE_Morph.prototype.createControlBar = function () {
    // assumes the logo has already been created
    var padding = 5,
        button,
        slider,
        stopButton,
        pauseButton,
        startButton,
        projectButton,
        settingsButton,
        stageSizeButton,
        appModeButton,
        steppingButton,
        cloudButton,
        x,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ],
        myself = this;

    if (this.controlBar) {
        this.controlBar.destroy();
    }

    this.controlBar = new Morph();
    this.controlBar.color = this.frameColor;
    this.controlBar.setHeight(this.logo.height()); // height is fixed
    this.controlBar.mouseClickLeft = function () {
        this.world().fillPage();
    };
    this.add(this.controlBar);

    //smallStageButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleStageSize',
        [
            new SymbolMorph('smallStage', 14),
            new SymbolMorph('normalStage', 14)
        ],
        function () {  // query
            return myself.isSmallStage;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'stage size\nsmall & normal';
    button.fixLayout();
    button.refresh();
    stageSizeButton = button;
    this.controlBar.add(stageSizeButton);
    this.controlBar.stageSizeButton = button; // for refreshing

    //appModeButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleAppMode',
        [
            new SymbolMorph('fullScreen', 14),
            new SymbolMorph('normalScreen', 14)
        ],
        function () {  // query
            return myself.isAppMode;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'app mode';
    button.fixLayout();
    button.refresh();
    appModeButton = button;
    this.controlBar.add(appModeButton);
    this.controlBar.appModeButton = appModeButton; // for refreshing

    //steppingButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleSingleStepping',
        [
            new SymbolMorph('footprints', 16),
            new SymbolMorph('footprints', 16)
        ],
        function () {  // query
            return Process.prototype.enableSingleStepping;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = new Color(153, 255, 213);
//    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Visible stepping';
    button.fixLayout();
    button.refresh();
    steppingButton = button;
    this.controlBar.add(steppingButton);
    this.controlBar.steppingButton = steppingButton; // for refreshing

    // stopButton
    button = new ToggleButtonMorph(
        null, // colors
        this, // the IDE is the target
        'stopAllScripts',
        [
            new SymbolMorph('octagon', 14),
            new SymbolMorph('square', 14)
        ],
        function () {  // query
            return myself.stage ?
                myself.stage.enableCustomHatBlocks &&
                myself.stage.threads.pauseCustomHatBlocks
                : true;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(200, 0, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'stop\nevery-\nthing';
    button.fixLayout();
    button.refresh();
    stopButton = button;
    this.controlBar.add(stopButton);
    this.controlBar.stopButton = stopButton; // for refreshing

    //pauseButton
    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'togglePauseResume',
        [
            new SymbolMorph('pause', 12),
            new SymbolMorph('pointRight', 14)
        ],
        function () {  // query
            return myself.isPaused();
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(255, 220, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'pause/resume\nall scripts';
    button.fixLayout();
    button.refresh();
    pauseButton = button;
    this.controlBar.add(pauseButton);
    this.controlBar.pauseButton = pauseButton; // for refreshing

    // startButton
    button = new PushButtonMorph(
        this,
        'pressStart',
        new SymbolMorph('flag', 14)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(0, 200, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'start green\nflag scripts';
    button.fixLayout();
    startButton = button;
    this.controlBar.add(startButton);
    this.controlBar.startButton = startButton;

    // steppingSlider
    slider = new SliderMorph(
        61,
        1,
        Process.prototype.flashTime * 100 + 1,
        6,
        'horizontal'
    );
    slider.action = function (num) {
        Process.prototype.flashTime = (num - 1) / 100;
        myself.controlBar.refreshResumeSymbol();
    };
    // slider.alpha = MorphicPreferences.isFlat ? 0.1 : 0.3;
    slider.color = new Color(153, 255, 213);
    slider.alpha = 0.3;
    slider.setExtent(new Point(50, 14));
    this.controlBar.add(slider);
    this.controlBar.steppingSlider = slider;

    // projectButton
    button = new PushButtonMorph(
        this,
        function() {
            var menu = myself.projectMenu(),
                pos = myself.controlBar.projectButton.bottomLeft(),
                world = myself.world();

            menu.popup(world, pos);
        },
        new SymbolMorph('file', 14)
        //'\u270E'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'open, save, & annotate project';
    button.fixLayout();
    projectButton = button;
    this.controlBar.add(projectButton);
    this.controlBar.projectButton = projectButton; // for menu positioning

    // settingsButton
    button = new PushButtonMorph(
        this,
        function() {
            var menu = myself.settingsMenu(),
                pos = myself.controlBar.settingsButton.bottomLeft();
            menu.popup(myself.world(), pos);
        },
        new SymbolMorph('gears', 14)
        //'\u2699'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'edit settings';
    button.fixLayout();
    settingsButton = button;
    this.controlBar.add(settingsButton);
    this.controlBar.settingsButton = settingsButton; // for menu positioning

    // cloudButton
    button = new PushButtonMorph(
        this,
        function() {
            var menu = myself.cloudMenu(),
                pos = myself.controlBar.cloudButton.bottomLeft();
            menu.popup(myself.world(), pos);
        },
        new SymbolMorph('cloud', 11)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'cloud operations';
    button.fixLayout();
    cloudButton = button;
    this.controlBar.add(cloudButton);
    this.controlBar.cloudButton = cloudButton; // for menu positioning

    this.controlBar.fixLayout = function () {
        x = this.right() - padding;
        [stopButton, pauseButton, startButton].forEach(
            function (button) {
                button.setCenter(myself.controlBar.center());
                button.setRight(x);
                x -= button.width();
                x -= padding;
            }
        );

        x = Math.min(
            startButton.left() - (3 * padding + 2 * stageSizeButton.width()),
            myself.right() - StageMorph.prototype.dimensions.x *
            (myself.isSmallStage ? myself.stageRatio : 1)
        );
        [stageSizeButton, appModeButton].forEach(
            function (button) {
                x += padding;
                button.setCenter(myself.controlBar.center());
                button.setLeft(x);
                x += button.width();
            }
        );

        slider.setCenter(myself.controlBar.center());
        slider.setRight(stageSizeButton.left() - padding);

        steppingButton.setCenter(myself.controlBar.center());
        steppingButton.setRight(slider.left() - padding);

        settingsButton.setCenter(myself.controlBar.center());
        settingsButton.setLeft(this.left());

        cloudButton.setCenter(myself.controlBar.center());
        cloudButton.setRight(settingsButton.left() - padding);

        projectButton.setCenter(myself.controlBar.center());
        projectButton.setRight(cloudButton.left() - padding);

        this.refreshSlider();
        this.updateLabel();
    };

    this.controlBar.refreshSlider = function () {
        if (Process.prototype.enableSingleStepping && !myself.isAppMode) {
            slider.drawNew();
            slider.show();
        } else {
            slider.hide();
        }
        this.refreshResumeSymbol();
    };

    this.controlBar.refreshResumeSymbol = function () {
        var pauseSymbols;
        if (Process.prototype.enableSingleStepping &&
            Process.prototype.flashTime > 0.5) {
            myself.stage.threads.pauseAll(myself.stage);
            pauseSymbols = [
                new SymbolMorph('pause', 12),
                new SymbolMorph('stepForward', 14)
            ];
        } else {
            pauseSymbols = [
                new SymbolMorph('pause', 12),
                new SymbolMorph('pointRight', 14)
            ];
        }
        pauseButton.labelString = pauseSymbols;
        pauseButton.createLabel();
        pauseButton.fixLayout();
        pauseButton.refresh();
    };

    this.controlBar.updateLabel = function () {
        var suffix = myself.world().isDevMode ?
            ' - ' + localize('development mode') : '';

        if (this.label) {
            this.label.destroy();
        }
        if (myself.isAppMode) {
            return;
        }

        this.label = new StringMorph(
            (myself.projectName || localize('untitled')) + suffix,
            14,
            'sans-serif',
            true,
            false,
            false,
            MorphicPreferences.isFlat ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast)
        );
        this.label.color = myself.buttonLabelColor;
        this.label.drawNew();
        this.add(this.label);
        this.label.setCenter(this.center());
        this.label.setLeft(this.settingsButton.right() + padding);
    };
};

IDE_Morph.prototype.createCategories = function () {
    var myself = this;

    if (this.categories) {
        this.categories.destroy();
    }
    this.categories = new Morph();
    this.categories.color = this.groupColor;
    this.categories.silentSetWidth(this.paletteWidth);

    function addCategoryButton(category) {
        var labelWidth = 75,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(50),
                SpriteMorph.prototype.blockColor[category]
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                myself.currentCategory = category;
                myself.categories.children.forEach(function (each) {
                    each.refresh();
                });
                myself.refreshPalette(true);
            },
            category[0].toUpperCase().concat(category.slice(1)), // label
            function () {  // query
                return myself.currentCategory === category;
            },
            null, // env
            null, // hint
            null, // template cache
            labelWidth, // minWidth
            true // has preview
        );

        button.corner = 8;
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        return button;
    }

    function fixCategoriesLayout() {
        var buttonWidth = myself.categories.children[0].width(),
            buttonHeight = myself.categories.children[0].height(),
            border = 3,
            rows =  Math.ceil((myself.categories.children.length) / 2),
            xPadding = (200 // myself.logo.width()
                - border
                - buttonWidth * 2) / 3,
            yPadding = 2,
            l = myself.categories.left(),
            t = myself.categories.top(),
            i = 0,
            row,
            col;

        myself.categories.children.forEach(function (button) {
            i += 1;
            row = Math.ceil(i / 2);
            col = 2 - (i % 2);
            button.setPosition(new Point(
                l + (col * xPadding + ((col - 1) * buttonWidth)),
                t + (row * yPadding + ((row - 1) * buttonHeight) + border)
            ));
        });

        myself.categories.setHeight(
            (rows + 1) * yPadding
            + rows * buttonHeight
            + 2 * border
        );
    }

    SpriteMorph.prototype.categories.forEach(function (cat) {
        if (!contains(['lists', 'other'], cat)) {
            addCategoryButton(cat);
        }
    });
    fixCategoriesLayout();
    this.add(this.categories);
};

IDE_Morph.prototype.createPalette = function (forSearching) {
    // assumes that the logo pane has already been created
    // needs the categories pane for layout
    var myself = this;

    if (this.palette) {
        this.palette.destroy();
    }

    if (forSearching) {
        this.palette = new ScrollFrameMorph(
            null,
            null,
            this.currentSprite.sliderColor
        );
    } else {
        this.palette = this.currentSprite.palette(this.currentCategory);
    }
    this.palette.isDraggable = false;
    this.palette.acceptsDrops = true;
    this.palette.enableAutoScrolling = false;
    this.palette.contents.acceptsDrops = false;

    this.palette.reactToDropOf = function (droppedMorph, hand) {
        if (droppedMorph instanceof DialogBoxMorph) {
            myself.world().add(droppedMorph);
        } else if (droppedMorph instanceof SpriteMorph) {
            SnapActions.removeSprite(droppedMorph);
        } else if (droppedMorph instanceof SpriteIconMorph) {
            droppedMorph.destroy();
            SnapActions.removeSprite(droppedMorph.object);
        } else if (droppedMorph instanceof CostumeIconMorph) {
            SnapActions.removeCostume(droppedMorph.object);
            droppedMorph.destroy();
        } else if (droppedMorph instanceof SoundIconMorph) {
            SnapActions.removeSound(droppedMorph.object);
            droppedMorph.destroy();
        } else {
            if (droppedMorph.id) {
                SnapActions.removeBlock(droppedMorph);
            } else {
                droppedMorph.destroy();
            }
        }
    };

    this.palette.setWidth(this.logo.width());
    this.add(this.palette);
    if (this.isAppMode) this.palette.hide();
    return this.palette;
};

IDE_Morph.prototype.createPaletteHandle = function () {
    // assumes that the palette has already been created
    if (this.paletteHandle) {this.paletteHandle.destroy(); }
    this.paletteHandle = new PaletteHandleMorph(this.categories);
    this.add(this.paletteHandle);
    if (this.isAppMode) this.paletteHandle.hide();
};

IDE_Morph.prototype.createStage = function () {
    // assumes that the logo pane has already been created
    if (this.stage) {this.stage.destroy(); }
    StageMorph.prototype.frameRate = 0;
    this.stage = new StageMorph(this.globalVariables);
    this.stage.setExtent(this.stage.dimensions); // dimensions are fixed
    if (this.currentSprite instanceof SpriteMorph) {
        this.currentSprite.setPosition(
            this.stage.center().subtract(
                this.currentSprite.extent().divideBy(2)
            )
        );
        this.stage.add(this.currentSprite);
    }
    this.add(this.stage);
};

IDE_Morph.prototype.createStageHandle = function () {
    // assumes that the stage has already been created
    if (this.stageHandle) {this.stageHandle.destroy(); }
    this.stageHandle = new StageHandleMorph(this.stage);
    this.add(this.stageHandle);
};

IDE_Morph.prototype.createSpriteBar = function () {
    // assumes that the categories pane has already been created
    var rotationStyleButtons = [],
        thumbSize = new Point(45, 45),
        nameField,
        padlock,
        thumbnail,
        tabCorner = 15,
        tabColors = this.tabColors,
        tabBar = new AlignmentMorph('row', -tabCorner * 2),
        tab,
        symbols = ['\u2192', '\u21BB', '\u2194'],
        labels = ['don\'t rotate', 'can rotate', 'only face left/right'],
        myself = this,
        subtaskTxt,
        colors = myself.rotationStyleColors,
        padding = 5;

    if (this.spriteBar) {
        this.spriteBar.destroy();
    }

    this.spriteBar = new Morph();
    this.spriteBar.color = this.frameColor;
    this.add(this.spriteBar);

    //CHANGES Starting here
    /*subtaskTxt = new TextMorph(subTasks[subTaskIndex]);
    subtaskTxt.fontSize = 14;
    subtaskTxt.setColor(SpriteMorph.prototype.paletteTextColor);
    subtaskTxt.setPosition(this.spriteBar.topLeft().add(30));

    this.spriteBar.add(subtaskTxt);

    nexttask = new PushButtonMorph(
        this,
        "switchTasks",
        new SymbolMorph("turtle", 14)
    );
    nexttask.corner = 12;
    nexttask.color = colors[0];
    nexttask.highlightColor = colors[1];
    nexttask.pressColor = colors[2];
    nexttask.labelMinExtent = new Point(36, 18);
    nexttask.padding = 0;
    nexttask.labelShadowOffset = new Point(-1, -1);
    nexttask.labelShadowColor = colors[1];
    nexttask.labelColor = this.buttonLabelColor;
    nexttask.contrast = this.buttonContrast;
    nexttask.drawNew();
    nexttask.fixLayout();
    nexttask.setPosition(this.spriteBar.topLeft().add(new Point(350, 50)));
    this.spriteBar.add(nexttask);*/
    function addRotationStyleButton(rotationStyle) {
        var colors = myself.rotationStyleColors,
            button;
        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                if (myself.currentSprite instanceof SpriteMorph) {
                    SnapActions.setRotationStyle(myself.currentSprite, rotationStyle);
                }
            },
            symbols[rotationStyle], // label
            function () {  // query
                return myself.currentSprite instanceof SpriteMorph
                    && myself.currentSprite.rotationStyle === rotationStyle;
            },
            null, // environment
            localize(labels[rotationStyle])
        );
        button.corner = 8;
        button.labelMinExtent = new Point(11, 11);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        rotationStyleButtons.push(button);
        button.setPosition(myself.spriteBar.position().add(2));
        button.setTop(button.top()
            + ((rotationStyleButtons.length - 1) * (button.height() + 2))
        );
        myself.spriteBar.add(button);
        if (myself.currentSprite instanceof StageMorph) {
            button.hide();
        }
        return button;
    }
    addRotationStyleButton(1);
    addRotationStyleButton(2);
    addRotationStyleButton(0);
    this.rotationStyleButtons = rotationStyleButtons;
    thumbnail = new Morph();
    thumbnail.setExtent(thumbSize);
    thumbnail.image = this.currentSprite.thumbnail(thumbSize);
    thumbnail.setPosition(
        rotationStyleButtons[0].topRight().add(new Point(5, 3))
    );
    this.spriteBar.add(thumbnail);
    thumbnail.fps = 3;
    thumbnail.step = function () {
        if (thumbnail.version !== myself.currentSprite.version) {
            thumbnail.image = myself.currentSprite.thumbnail(thumbSize);
            thumbnail.changed();
            thumbnail.version = myself.currentSprite.version;
        }
    };
    nameField = new InputFieldMorph(this.currentSprite.name);
    nameField.setWidth(100); // fixed dimensions
    nameField.contrast = 90;
    nameField.setPosition(thumbnail.topRight().add(new Point(10, 3)));
    this.spriteBar.add(nameField);
    nameField.drawNew();
    nameField.accept = function () {
        var newName = nameField.getValue(),
            currentName = myself.currentSprite.name,
            safeName = myself.newSpriteName(newName, myself.currentSprite);
        if (safeName !== currentName) {
            return SnapActions.renameSprite(myself.currentSprite, safeName);
        } else {
            nameField.setContents(safeName);
        }
    };
    this.spriteBar.nameField = nameField;
    this.spriteBar.reactToEdit = nameField.accept;
    // padlock
    padlock = new ToggleMorph(
        'checkbox',
        null,
        function () {
            SnapActions.toggleDraggable(myself.currentSprite, !myself.currentSprite.isDraggable);
        },
        localize('draggable'),
        function () {
            return myself.currentSprite.isDraggable;
        }
    );
    padlock.label.isBold = false;
    padlock.label.setColor(this.buttonLabelColor);
    padlock.color = tabColors[2];
    padlock.highlightColor = tabColors[0];
    padlock.pressColor = tabColors[1];
    padlock.tick.shadowOffset = MorphicPreferences.isFlat ?
        new Point() : new Point(-1, -1);
    padlock.tick.shadowColor = new Color(); // black
    padlock.tick.color = this.buttonLabelColor;
    padlock.tick.isBold = false;
    padlock.tick.drawNew();
    padlock.setPosition(nameField.bottomLeft().add(2));
    padlock.drawNew();
    this.spriteBar.add(padlock);
    this.spriteBar.padlock = padlock;
    if (this.currentSprite instanceof StageMorph) {
        padlock.hide();
    }

    // tab bar
    tabBar.tabTo = function (tabString) {
        var active;
        myself.currentTab = tabString;
        this.children.forEach(function (each) {
            each.refresh();
            if (each.state) {active = each; }
        });
        active.refresh(); // needed when programmatically tabbing
        myself.createSpriteEditor();
        myself.fixLayout('tabEditor');
    };

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            SnapActions.selectTab('scripts');
            tabBar.tabTo('scripts');
        },
        localize('Scripts'), // label
        function () {  // query
            return myself.currentTab === 'scripts';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            SnapActions.selectTab('costumes');
            tabBar.tabTo('costumes');
        },
        localize(this.currentSprite instanceof SpriteMorph ?
            'Costumes' : 'Backgrounds'
        ),
        function () {  // query
            return myself.currentTab === 'costumes';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            SnapActions.selectTab('sounds');
            tabBar.tabTo('sounds');
        },
        localize('Sounds'), // label
        function () {  // query
            return myself.currentTab === 'sounds';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    tabBar.add(tab);

    /* start testing sprites and stage tab */
    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            SnapActions.selectTab('sprites');
            tabBar.tabTo('sprites');
        },
        localize('Sprites'), // label
        function () {  // query
            return myself.currentTab === 'sprites';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    tabBar.add(tab);
    /* end testing sprites and stage tab */

    tabBar.fixLayout();
    tabBar.children.forEach(function (each) {
        each.refresh();
    });
    this.spriteBar.tabBar = tabBar;
    this.spriteBar.add(this.spriteBar.tabBar);

    this.spriteBar.fixLayout = function () {
        this.tabBar.setLeft(this.left());
        this.tabBar.setBottom(this.bottom());
    };
    if (this.isAppMode) this.spriteBar.hide();
};

IDE_Morph.prototype.createSpriteEditor = function () {
    // assumes that the logo pane and the stage have already been created
    var scripts = this.currentSprite.scripts,
        myself = this,
        template,
        frame,
        padding = 5;


    if (this.spriteEditor) {
        this.spriteEditor.destroy();
    }

    if (this.currentTab === 'scripts') {
        scripts.isDraggable = false;
        scripts.color = this.groupColor;
        scripts.cachedTexture = this.scriptsPaneTexture;

        this.spriteEditor = new ScrollFrameMorph(
            scripts,
            null,
            this.sliderColor
        );

        this.spriteEditor.padding = 10;
        this.spriteEditor.growth = 50;
        this.spriteEditor.isDraggable = false;
        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = true;

        scripts.scrollFrame = this.spriteEditor;
        this.add(this.spriteEditor);
        this.spriteEditor.scrollX(this.spriteEditor.padding);
        this.spriteEditor.scrollY(this.spriteEditor.padding);
    } else if (this.currentTab === 'costumes') {
        this.spriteEditor = new WardrobeMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);
        this.spriteEditor.updateSelection();

        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else if (this.currentTab === 'sounds') {
        this.spriteEditor = new JukeboxMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);
        this.spriteEditor.updateSelection();
        this.spriteEditor.acceptDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else if (this.currentTab === 'sprites') {
    } else {
        this.spriteEditor = new Morph();
        this.spriteEditor.color = this.groupColor;
        this.spriteEditor.acceptsDrops = true;
        this.spriteEditor.reactToDropOf = function (droppedMorph) {
            if (droppedMorph instanceof DialogBoxMorph) {
                myself.world().add(droppedMorph);
            } else if (droppedMorph instanceof SpriteMorph) {
                myself.removeSprite(droppedMorph);
            } else {
                droppedMorph.destroy();
            }
        };
        this.add(this.spriteEditor);
    }

    this.activeEditor.onSetActive();
};

IDE_Morph.prototype.createSpeechBubblePanel = function () {
    if (this.speechBubblePanel) {this.speechBubblePanel.destroy(); }
    this.speechBubblePanel = new ScrollFrameMorph(null, null, this.sliderColor);
    this.speechBubblePanel.color = "#F6E2CD";
    this.add(this.speechBubblePanel);
    this.speechBubblePanel.acceptsDrops = false;
    this.speechBubblePanel.contents.acceptsDrops = false;

//Blue shirt #1e2757
//Purple shirt #392044
//Beige wall #f8e2cd
    var recent = false;
    var vColor = "#2B1634";
    var jColor = "#1E2757";
    var prevSpeechBubbleHeight=35;
    var prevSpeechBubbleBottom=100;

    var bottomOff = 100;
    var first = true;
    var i;
    for (i = 0; i < conversationHistory.length; i++) {
        if (i >= conversationHistory.length - 2) {
            recent = true;
        }

        if (recent) {
            vColor = "#8745a3";
            jColor = "#4558c4";
        } else {
            vColor = "#2B1634";
            jColor = "#1E2757";
        }


        if (speakerHistory[i] == 'v') {
            speechbubble = new AgentSpeechBubbleMorph(conversationHistory[i], vColor, true);
            speechbubble.setLeft(0);
        } else if (speakerHistory[i] == 'j')  {
            speechbubble = new AgentSpeechBubbleMorph(conversationHistory[i], jColor, false);
            speechbubble.setRight(465);
        } else {
            speechbubble = new AgentSpeechBubbleMorph(conversationHistory[i], "#F6E2CD", false, "#F6E2CD");
        }
        //Throw a speech bubble that neither person says that is meta information
        //prevSpeechBubbleBottom run a counter for how many have occurred or boolean
        //Make an empty speech bubble that's the same color as the panel background

        speechbubble.setTop(this.speechBubblePanel.top() + prevSpeechBubbleBottom+1);

        prevSpeechBubbleHeight=speechbubble.height();
        prevSpeechBubbleBottom=speechbubble.bottom();
        this.speechBubblePanel.addContents(speechbubble);
    }

    if (this.isAppMode){
        bottomOff = prevSpeechBubbleBottom - (this.agentPanel.top()) + this.stage.height()/2;
        this.speechBubblePanel.contents.moveBy(new Point(0, -bottomOff));
    }
    else {
        bottomOff = prevSpeechBubbleBottom - (this.agentPanel.top() - this.corralBar.bottom());
        this.speechBubblePanel.contents.moveBy(new Point(0, -bottomOff));
    }

    this.speechBubblePanel.adjustScrollBars();

    //this.speechBubblePanel.adjustScrollBars();
    //this.speechBubblePanel.scrollY(this.speechBubblePanel.contents.bottom());


}

IDE_Morph.prototype.createAgentControllerBar = function () {
    var button,
        myself = this,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ];

    if (this.agentControllerBar) {
        this.agentControllerBar.destroy();
    }

    this.agentControllerBar = new Morph();
    this.agentControllerBar.color = "transparent";
    this.agentControllerBar.setHeight(20);
    this.agentPanel.add(this.agentControllerBar);


    //pauseButton
    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'pauseConversation',
        [
            new SymbolMorph('pause', 12),
            new SymbolMorph('pointRight', 14)
        ],
        function () {  // query
        return myself.stage ?
            myself.stage.enableCustomHatBlocks &&
            myself.stage.threads.pauseCustomHatBlocks
            : true;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(255, 220, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'pause/resume';
    button.fixLayout();
    button.refresh();
    pauseButton = button;
    this.agentControllerBar.add(pauseButton);
    this.agentControllerBar.pauseButton = pauseButton; // for refreshing

    // replayButton
    button = new PushButtonMorph(
        this, // the IDE is the target
        'pauseConversation',
        new SymbolMorph('turnBack', 12)
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(0, 200, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'replay';
    button.fixLayout();
    startButton = button;
    this.agentControllerBar.add(startButton);
    this.agentControllerBar.startButton = startButton;

    pauseButton.setCenter(myself.agentControllerBar.center());
    pauseButton.setLeft(this.agentControllerBar.left());
    startButton.setCenter(myself.agentControllerBar.center());
    startButton.setRight(90);
}

IDE_Morph.prototype.createAgentPanel = function (imageNum) {
    console.log("In IDE_Morph.prototype.createAgentPanel");

    if (this.agentPanel) {this.agentPanel.destroy(); }
    this.agentPanel = new FrameMorph();
    //if (this.isAppMode) this.agentPanel.hide();

    this.agentPanel.cachedTexture = agentPanelTextureArray[imageNum];
    this.agentPanel.drawCachedTexture();
    this.agentPanel.color="#F6E2CD";


    window.setTimeout(this.add(this.agentPanel),50);
    this.agentPanel.acceptsDrops = false;

    this.createAgentControllerBar();

    this.agentPanel.drawCachedTexture = function () {
        var context = this.image.getContext('2d');

        var windowHeight = window.screen.height; //* window.devicePixelRatio;
        //480 * 360
        // * .5
        var width,
            height,
            left;

        // console.log("Window height: " + windowHeight);
        if (windowHeight < 600) {
            width = this.cachedTexture.width * .65,
                height = this.cachedTexture.height * .55 ;
        } else if (windowHeight >= 600 && windowHeight < 768){
            width = this.cachedTexture.width*.85,
                height = this.cachedTexture.height*.75;
        } else if (windowHeight >= 768 && windowHeight < 992) {
            width = this.cachedTexture.width*.95,
                height = this.cachedTexture.height*.85;
        } else if (windowHeight >= 992 && windowHeight < 1200) {
            width = this.cachedTexture.width*.9,
                height = this.cachedTexture.height*.9;
        } else {
            //Window 1200+
            width = this.cachedTexture.width,
                height = this.cachedTexture.height;
        }
        // console.log(width);
        // console.log(windowHeight);

        left = (480-width)/2;

        window.setTimeout(context.drawImage(this.cachedTexture, left, 0,
            width, height), 1000);



    };

    if (countButtonCreated < 4) {
        //Start Button
        var button,
        myself = this
            
        button = new PushButtonMorph(
            this, // the IDE is the target
            'pauseConversation',
            new SymbolMorph('pointRight', 44)
        );

        button.corner = 12;
        // button.color = "transparent";
        button.color = new Color(255, 0, 0, 0.2);
        // button.backgroundColor = new Color(203,179,255,0.9);
        button.pressColor = new Color(255, 0, 0, 0.2);
        button.highlightColor = new Color(255, 0, 0, 0.2);



        button.padding = 10;
        // button.labelColor = new Color(255, 220, 0);
        button.hint = 'START';
        button.setHeight(0);
        button.setWidth(0);
        button.setLeft(235);
        button.setTop(150);
        startAgentsButton = button;
        this.agentPanel.add(startAgentsButton);
        console.log("Start Button Created!");
        this.agentPanel.startAgentsButton = startAgentsButton; // for refreshing

        countButtonCreated += 1;

    }
}

IDE_Morph.prototype.createAgentImage = function () {
    console.log("createAgentImage");
    var myself = this;


};

IDE_Morph.prototype.createCorralBar = function () {
    // assumes the stage has already been created
    var padding = 5,
        newbutton,
        paintbutton,
        agentbutton,
        switchagentbutton,
        myself = this,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ];

    if (this.corralBar) {
        this.corralBar.destroy();
    }

    this.corralBar = new Morph();
    this.corralBar.color = this.frameColor;
    this.corralBar.setHeight(10); // height is fixed
    this.add(this.corralBar);

    // new sprite button
    newbutton = new PushButtonMorph(
        this,
        "addNewSprite",
        new SymbolMorph("turtle", 14)
    );
    newbutton.corner = 12;
    newbutton.color = colors[0];
    newbutton.highlightColor = colors[1];
    newbutton.pressColor = colors[2];
    newbutton.labelMinExtent = new Point(36, 18);
    newbutton.padding = 0;
    newbutton.labelShadowOffset = new Point(-1, -1);
    newbutton.labelShadowColor = colors[1];
    newbutton.labelColor = this.buttonLabelColor;
    newbutton.contrast = this.buttonContrast;
    newbutton.drawNew();
    newbutton.hint = "add a new Turtle sprite";
    newbutton.fixLayout();
    newbutton.setCenter(this.corralBar.center());
    newbutton.setLeft(this.corralBar.left() + padding);
    // this.corralBar.add(newbutton); // I added this.

    //testing toggle agent
    agentbutton = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleAgentSize',
        [
            new SymbolMorph('speechBubble', 14),
            new SymbolMorph('speechBubbleInvert', 14)
        ],
        function () {  // query
            return myself.isSmallStage;
        }
    );

    agentbutton.corner = 12;
    agentbutton.color = colors[0];
    agentbutton.highlightColor = colors[1];
    agentbutton.pressColor = colors[2];
    agentbutton.labelMinExtent = new Point(36, 18);
    agentbutton.padding = 0;
    agentbutton.labelShadowOffset = new Point(-1, -1);
    agentbutton.labelShadowColor = colors[1];
    agentbutton.labelColor = this.buttonLabelColor;
    agentbutton.contrast = this.buttonContrast;
    agentbutton.drawNew();
    // button.hint = 'stage size\nsmall & normal';
    agentbutton.fixLayout();
    agentbutton.setCenter(this.corralBar.center());
    agentbutton.setLeft(
        this.corralBar.left() + padding + newbutton.width() + padding
    );
    agentbutton.refresh();
    agentSizeButton = agentbutton;
    //this.corralBar.add(agentSizeButton);
    this.corralBar.agentSizeButton = agentbutton; // for refreshing
};

IDE_Morph.prototype.createCorral = function () {
    // assumes the corral bar has already been created
    var frame, template, padding = 5, myself = this;

    this.createStageHandle();
    this.createPaletteHandle();

    this.createAgentPanel(0);
    this.createSpeechBubblePanel();

    if (this.corral) {
        this.corral.destroy();
    }

    this.corral = new Morph();
    this.corral.color = this.groupColor;
    this.add(this.corral);

    this.corral.stageIcon = new SpriteIconMorph(this.stage);
    this.corral.stageIcon.isDraggable = false;
    this.corral.add(this.corral.stageIcon);

    frame = new ScrollFrameMorph(null, null, this.sliderColor);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    frame.contents.wantsDropOf = function (morph) {
        return morph instanceof SpriteIconMorph;
    };

    frame.contents.reactToDropOf = function (spriteIcon) {
        myself.corral.reactToDropOf(spriteIcon);
    };

    frame.alpha = 0;

    this.sprites.asArray().forEach(function (morph) {
        if (!morph.isClone) {
            template = new SpriteIconMorph(morph, template);
            frame.contents.add(template);
        }
    });

    this.corral.frame = frame;
    this.corral.add(frame);

    this.corral.fixLayout = function () {
        this.stageIcon.setCenter(this.center());
        this.stageIcon.setLeft(this.left() + padding);
        this.frame.setLeft(this.stageIcon.right() + padding);
        this.frame.setExtent(new Point(
            this.right() - this.frame.left(),
            this.height()
        ));
        this.arrangeIcons();
        this.refresh();
    };

    this.corral.arrangeIcons = function () {
        var x = this.frame.left(),
            y = this.frame.top(),
            max = this.frame.right(),
            start = this.frame.left();

        this.frame.contents.children.forEach(function (icon) {
            var w = icon.width();

            if (x + w > max) {
                x = start;
                y += icon.height(); // they're all the same
            }
            icon.setPosition(new Point(x, y));
            x += w;
        });
        this.frame.contents.adjustBounds();
    };

    //create agentPanel that isn't visible and keep corral the same size
    //then, when button is pressed, make corral invisible and agent panel larger

    this.corral.addSprite = function (sprite) {
        this.frame.contents.add(new SpriteIconMorph(sprite));
        this.fixLayout();
    };

    this.corral.refresh = function () {
        this.stageIcon.refresh();
        this.frame.contents.children.forEach(function (icon) {
            icon.refresh();
        });
    };

    this.corral.wantsDropOf = function (morph) {
        return morph instanceof SpriteIconMorph;
    };

    this.corral.reactToDropOf = function (spriteIcon) {
        var idx = 1,
            pos = spriteIcon.position(),
            stillExists = !!SnapActions.getOwnerFromId(spriteIcon.object.id);

        spriteIcon.destroy();
        if (stillExists) {
            this.frame.contents.children.forEach(function (icon) {
                if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
                    idx += 1;
                }
            });
            myself.sprites.add(spriteIcon.object, idx);
            myself.createCorral();
            myself.fixLayout();
        }
    };

    this.corral.userMenu = function() {
        var menu = new MenuMorph(this),
            action,
            deletedSprite,
            len;

        if (SnapUndo.canUndo('corral')) {
            // get the deleted sprite's name
            len = SnapUndo.eventHistory.corral.length;
            action = SnapUndo.eventHistory.corral[len-1];
            deletedSprite = myself.serializer.parse(action.args[1])
                .childrenNamed('sprite')[0];

            menu.addItem(
                'restore ' + deletedSprite.attributes.name,
                function() {
                    SnapUndo.undo('corral');
                }
            );
        }
        return menu;
    };

    if (this.isAppMode) this.corral.hide();
};

IDE_Morph.prototype.createReplayControls = function () {
    var myself = this;
    this.replayControls = new ReplayControls(this);

    this.add(this.replayControls);
    this.replayControls.drawNew();
    this.replayControls.hide();
};

// IDE_Morph layout

IDE_Morph.prototype.fixLayout = function (situation) {
    // situation is a string, i.e.
    // 'selectSprite' or 'refreshPalette' or 'tabEditor'
    var padding = this.padding,
        maxPaletteWidth;

    Morph.prototype.trackChanges = false;

    if (situation !== 'refreshPalette') {
        // controlBar
        this.controlBar.setPosition(this.logo.topRight());
        this.controlBar.setWidth(this.right() - this.controlBar.left());
        this.controlBar.fixLayout();

        // categories
        this.categories.setLeft(this.logo.left());
        this.categories.setTop(this.logo.bottom());
        this.categories.setWidth(this.paletteWidth);
    }

    // palette
    this.palette.setLeft(this.logo.left());
    this.palette.setTop(this.categories.bottom());
    this.palette.setHeight(this.bottom() - this.palette.top());
    this.palette.setWidth(this.paletteWidth);

    if (situation !== 'refreshPalette') {
        // stage
        if (this.isAppMode) {
            this.agentPanel.setWidth(this.stage.width()*2);
            this.agentPanel.setCenter(this.center());
            this.agentPanel.setLeft(this.stage.width()/2);
        } else {
            this.stage.setScale(this.isSmallStage ? this.stageRatio : 1);
            this.stage.setTop(this.logo.bottom() + padding);
            this.stage.setRight(this.right());
            maxPaletteWidth = Math.max(
                200,
                this.width() -
                this.stage.width() -
                this.spriteBar.tabBar.width() -
                (this.padding * 2)
            );
            if (this.paletteWidth > maxPaletteWidth) {
                this.paletteWidth = maxPaletteWidth;
                this.fixLayout();
            }
            //this.stageHandle.fixLayout();
            //this.paletteHandle.fixLayout();
        }

        // spriteBar
        this.spriteBar.setLeft(this.paletteWidth + padding);
        this.spriteBar.setTop(this.logo.bottom() + padding);
        this.spriteBar.setExtent(new Point(
            Math.max(0, this.stage.left() - padding - this.spriteBar.left()),
            this.categories.bottom() - this.spriteBar.top() - padding
        ));
        this.spriteBar.fixLayout();

        // spriteEditor
        if (this.spriteEditor.isVisible) {
            this.spriteEditor.setPosition(this.spriteBar.bottomLeft());
            this.spriteEditor.setExtent(new Point(
                this.spriteBar.width(),
                this.bottom() - this.spriteEditor.top()
            ));
        }


        //speechBubblePanel
        if (this.isAppMode) {
            this.speechBubblePanel.setTop(this.top()+this.stage.height()/2);
            this.speechBubblePanel.setLeft(this.left() + this.width() / 3);
            this.speechBubblePanel.setWidth(this.stage.width());
            if ((this.bottom() - this.corralBar.bottom())*.50 <=360) {
                this.speechBubblePanel.setHeight((this.bottom() - this.corralBar.bottom())*.20);
                // console.log("go 1");
            } else {
                this.speechBubblePanel.setHeight(this.bottom() - this.corralBar.bottom() - 360);
                // console.log("go 2");
            }
        }else{
            this.speechBubblePanel.setTop(this.corralBar.bottom());
            this.speechBubblePanel.setLeft(this.stage.left());
            this.speechBubblePanel.setWidth(this.stage.width());
            if ((this.bottom() - this.corralBar.bottom())*.20 <=360) {
                this.speechBubblePanel.setHeight((this.bottom() - this.corralBar.bottom())*.20);
            } else {
                this.speechBubblePanel.setHeight(this.bottom() - this.corralBar.bottom() - 360);
            }
        }


        //agentPanel
        //this.agentPanel.setBottom(this.bottom()); //hide corral bar / check hte default setting
        if (this.isAppMode) {
            this.agentPanel.setPosition(this.speechBubblePanel.bottomLeft());
            this.agentPanel.setLeft(this.left() + this.width() / 3);
            this.agentPanel.setWidth(this.stage.width());
            if ((this.bottom() - this.corralBar.bottom())*.50 <=360) {
                this.agentPanel.setHeight((this.bottom() - this.corralBar.bottom())*.80);
            } else {
                this.agentPanel.setHeight(360);
            }
        } else{
            this.agentPanel.setPosition(this.speechBubblePanel.bottomLeft());
            this.agentPanel.setLeft(this.stage.left());
            this.agentPanel.setWidth(this.stage.width());
            if ((this.bottom() - this.corralBar.bottom())*.80 <=360) {
                this.agentPanel.setHeight((this.bottom() - this.corralBar.bottom())*.80);
            } else {
                this.agentPanel.setHeight(360);
            }

        }
        // agentControllerBar
        this.agentControllerBar.setRight(this.agentPanel.right()-25);
        this.agentControllerBar.setBottom(this.agentPanel.bottom()-10); //FLECKS change the location of the buttons
        this.agentControllerBar.setWidth(90);

        // corralBar
        this.corralBar.setLeft(this.stage.left());
        this.corralBar.setTop(this.stage.bottom());
        this.corralBar.setWidth(1);

        if (firstInterfaceCreation) {
            speechLeft = this.corralBar.left();
            speechRight = this.corralBar.right();
            firstInterfaceCreation=false;
        }

        // corral
        // Jen note: this affects the sprite and stage under the corral
        if (!contains(['selectSprite', 'tabEditor'], situation)) {
            this.corral.setPosition(this.spriteBar.bottomLeft());
            this.corral.setWidth(this.spriteBar.width());
            this.corral.setHeight(this.bottom() - this.corral.top());
            this.corral.fixLayout();
        }
    }

    var width = Math.max(this.width() * 0.8, 250);

    // Set position
    this.removeChild(this.replayControls);
    this.add(this.replayControls);  // make sure it is on top!

    this.replayControls.setWidth(this.width()-40);
    this.replayControls.setHeight(80);
    this.replayControls.setCenter(new Point(this.width()/2, 0));
    this.replayControls.setBottom(this.bottom());
    this.replayControls.fixLayout();

    Morph.prototype.trackChanges = true;
    this.changed();

    // also re-arrange mobile mode
    if (this.isAppMode && this.isMobileDevice()) {
        // if mobilemode is fully initialized
        if (this.mobileMode.buttons.length !== 0) this.mobileMode.fixLayout();
    }
};

IDE_Morph.prototype.setProjectName = function (string) {
    this.projectName = string.replace(/['"]/g, ''); // filter quotation marks
    this.hasChangedMedia = true;
    this.controlBar.updateLabel();
};

// IDE_Morph resizing

IDE_Morph.prototype.setExtent = function (point) {
    var padding = new Point(430, 110),
        minExt,
        ext,
        maxWidth,
        minWidth,
        maxHeight,
        minRatio,
        maxRatio;

    // determine the minimum dimensions making sense for the current mode
    if (this.isAppMode) {
        if (this.isMobileDevice()) {
            minExt = {x: 10, y: 10}; // min dimensions
        } else {
            minExt = StageMorph.prototype.dimensions.add(
                this.controlBar.height() + 10
            );
        }
    } else {
        if (this.stageRatio > 1) {
            minExt = padding.add(StageMorph.prototype.dimensions);
        } else {
            minExt = padding.add(
                StageMorph.prototype.dimensions.multiplyBy(this.stageRatio)
            );
        }
    }
    ext = point.max(minExt);

    // adjust stage ratio if necessary
    maxWidth = ext.x -
        (200 + this.spriteBar.tabBar.width() + (this.padding * 2));
    minWidth = SpriteIconMorph.prototype.thumbSize.x * 3;
    maxHeight = (ext.y - SpriteIconMorph.prototype.thumbSize.y * 3.5);
    minRatio = minWidth / this.stage.dimensions.x;
    maxRatio = Math.min(
        (maxWidth / this.stage.dimensions.x),
        (maxHeight / this.stage.dimensions.y)
    );
    this.stageRatio = Math.min(maxRatio, Math.max(minRatio, this.stageRatio));

    // apply
    IDE_Morph.uber.setExtent.call(this, ext);
    this.fixLayout();
};

// IDE_Morph events

IDE_Morph.prototype.reactToWorldResize = function (rect) {
    if (this.isAutoFill) {
        this.setPosition(rect.origin);
        this.setExtent(rect.extent());
    }
    if (this.filePicker) {
        document.body.removeChild(this.filePicker);
        this.filePicker = null;
    }
};

IDE_Morph.prototype.droppedImage = function (aCanvas, name) {
    var costume = new Costume(
        aCanvas,
        this.currentSprite.newCostumeName(
            name ? name.split('.')[0] : '' // up to period
        )
    );

    if (costume.isTainted()) {
        this.inform(
            'Unable to import this image',
            'The picture you wish to import has been\n' +
            'tainted by a restrictive cross-origin policy\n' +
            'making it unusable for costumes in Snap!. \n\n' +
            'Try downloading this picture first to your\n' +
            'computer, and import it from there.'
        );
        return;
    }

    SnapActions.addCostume(costume, this.currentSprite, true);
};

IDE_Morph.prototype.droppedSVG = function (anImage, name) {
    var costume = new SVG_Costume(anImage, name.split('.')[0]);
    SnapActions.addCostume(costume, this.currentSprite, true);
};

IDE_Morph.prototype.droppedAudio = function (anAudio, name) {
    var sound = new Sound(anAudio, name.split('.')[0]);  // up to period

    SnapActions.addSound(sound, this.currentSprite, true);
};

IDE_Morph.prototype.droppedText = function (aString, name) {
    var lbl = name ? name.split('.')[0] : '';
    if (aString.indexOf('<project') === 0) {
        location.hash = '';
        SnapActions.disableCollaboration();
        SnapUndo.reset();
        return this.openProjectString(aString);
    }
    if (aString.indexOf('<replay') === 0) {
        return this.openReplayString(aString);
    }
    if (aString.indexOf('<snapdata') === 0) {
        SnapActions.disableCollaboration();
        SnapUndo.reset();
        location.hash = '';
        return this.openCloudDataString(aString);
    }
    if (aString.indexOf('<blocks') === 0) {
        return SnapActions.importBlocks(aString, lbl);
    }
    if (aString.indexOf('<sprites') === 0) {
        return SnapActions.importSprites(aString);
    }
    if (aString.indexOf('<media') === 0) {
        return this.openMediaString(aString);
    }
};

IDE_Morph.prototype.droppedBinary = function (anArrayBuffer, name) {
    // dynamically load ypr->Snap!
    var ypr = document.getElementById('ypr'),
        myself = this,
        suffix = name.substring(name.length - 3);

    if (suffix.toLowerCase() !== 'ypr') {return; }

    function loadYPR(buffer, lbl) {
        var reader = new sb.Reader(),
            pname = lbl.split('.')[0]; // up to period
        reader.onload = function (info) {
            myself.droppedText(new sb.XMLWriter().write(pname, info));
        };
        reader.readYPR(new Uint8Array(buffer));
    }

    if (!ypr) {
        ypr = document.createElement('script');
        ypr.id = 'ypr';
        ypr.onload = function () {loadYPR(anArrayBuffer, name); };
        document.head.appendChild(ypr);
        ypr.src = 'ypr.js';
    } else {
        loadYPR(anArrayBuffer, name);
    }
};

// IDE_Morph button actions

IDE_Morph.prototype.refreshPalette = function (shouldIgnorePosition) {
    var oldTop = this.palette.contents.top();

    this.createPalette();
    this.fixLayout('refreshPalette');
    if (!shouldIgnorePosition) {
        this.palette.contents.setTop(oldTop);
    }
};

IDE_Morph.prototype.pressStart = function () {
    SnapActions.pressStart(this.world().currentKey === 16);
    if (this.world().currentKey === 16) { // shiftClicked
        this.toggleFastTracking();
    } else {
        this.stage.threads.pauseCustomHatBlocks = false;
        this.controlBar.stopButton.refresh();
        this.runScripts();
    }
};

IDE_Morph.prototype.toggleFastTracking = function () {
    if (this.stage.isFastTracked) {
        this.stopFastTracking();
    } else {
        this.startFastTracking();
    }
};

IDE_Morph.prototype.toggleVariableFrameRate = function () {
    if (StageMorph.prototype.frameRate) {
        StageMorph.prototype.frameRate = 0;
        this.stage.fps = 0;
    } else {
        StageMorph.prototype.frameRate = 30;
        this.stage.fps = 30;
    }
};

IDE_Morph.prototype.toggleCollaborativeEditing = function () {
    var myself = this;

    if (SnapActions.isCollaborating()) {
        SnapActions.disableCollaboration();
    } else if (this.isReplayMode) {
        this.confirm(
            'Cannot enter collaborate while in replay mode. \nWould you ' +
            'like to exit replay mode and enable collaborative editing?',
            'Exit Replay Mode?',
            function() {
                myself.exitReplayMode();
                SnapActions.enableCollaboration();
            }
        );
    } else {
        SnapActions.enableCollaboration();
    }
};

IDE_Morph.prototype.toggleSingleStepping = function () {
    this.stage.threads.toggleSingleStepping();
    this.controlBar.steppingButton.refresh();
    this.controlBar.refreshSlider();
};

IDE_Morph.prototype.startFastTracking = function () {
    this.stage.isFastTracked = true;
    this.stage.fps = 0;
    this.controlBar.startButton.labelString = new SymbolMorph('flash', 14);
    this.controlBar.startButton.drawNew();
    this.controlBar.startButton.fixLayout();
};

IDE_Morph.prototype.stopFastTracking = function () {
    this.stage.isFastTracked = false;
    this.stage.fps = this.stage.frameRate;
    this.controlBar.startButton.labelString = new SymbolMorph('flag', 14);
    this.controlBar.startButton.drawNew();
    this.controlBar.startButton.fixLayout();
};

IDE_Morph.prototype.runScripts = function () {
    this.stage.fireGreenFlagEvent();
};

IDE_Morph.prototype.togglePauseResume = function () {
    SnapActions.togglePause(this.stage.threads.isPaused());
    if (this.stage.threads.isPaused()) {
        this.stage.threads.resumeAll(this.stage);
    } else {
        this.stage.threads.pauseAll(this.stage);
    }
    this.controlBar.pauseButton.refresh();
};

IDE_Morph.prototype.isPaused = function () {
    if (!this.stage) {return false; }
    return this.stage.threads.isPaused();
};

IDE_Morph.prototype.stopAllScripts = function () {
    SnapActions.stopAllScripts();
    if (this.stage.enableCustomHatBlocks) {
        this.stage.threads.pauseCustomHatBlocks =
            !this.stage.threads.pauseCustomHatBlocks;
    } else {
        this.stage.threads.pauseCustomHatBlocks = false;
    }
    this.controlBar.stopButton.refresh();
    this.stage.fireStopAllEvent();
    BlockMorph.prototype.snapSound.pause();
};

IDE_Morph.prototype.pauseConversation = function () {
    this.conversationPause = ! this.conversationPause;
};

// async function callIntervention(req, res) {
//     const fetch = require("node-fetch");
//     const intervention = await fetch('http://localhost:8888/api/wizard/preview/facilitator/a1/activity/61072c2b95b2fb09c44fd613')
//         // .then(res => res.text())
//         console.log("intervention: "+ JSON.stringify(intervention))

// }


// IDE_Morph.prototype.startIntervention = function (response) {
//     if (response == "askWhy"){
//         this.interventionNumber = 1;
//     } 
//     else if (response == "X"){
//         this.interventionNumber = 1;
//     } 
    
// }

IDE_Morph.prototype.initiateIntervention = function (interventionNumber) {
    if (interventionNumber == 1) {
        moreConvo = true;
        window['futureConversation'+convoNum] = futureConversation13;
        window['futureSpeaker'+convoNum] = futureSpeaker13;
        window['futureAudio'+convoNum] = futureAudio13;
        window['audioTimes'+convoNum] = audioTimes13;
        window['futureImages'+convoNum] = futureImages13;
    }
    else if (interventionNumber == 2) {
        moreConvo = true;
        window['futureConversation'+convoNum] = futureConversation1;
        window['futureSpeaker'+convoNum] = futureSpeaker1;
        window['futureAudio'+convoNum] = futureAudio1;
        window['audioTimes'+convoNum] = audioTimes1;
        window['futureImages'+convoNum] = futureImages1;
    }
};

IDE_Morph.prototype.replayConversation = function () {
    this.conversationReplay = true;
    SnapActions.convoNum = 1;
    SnapActions.firstAction = true;

    conversationHistory = [];

    futureConversation = [" ",
        "Hi, I’m Viviana. But you can call me Vivi.",
        "My name's Jeremy, but you can call me Jay.",
        "We heard you would be coding today.",
        "We did some coding at our school too!",
        "We were partners, and you're gonna have a partner too.",
        "Good luck!"];

    futureAudio = ["",
        "1_Viviana_HiImVivianaButYouCanCallMeVivi.mp3",
        "2_Jeremy_MyNamesJeremy_TAKE1.mp3",
        "3_Viviana_WeHeardYouWouldBeCodingToday.mp3",
        "4_Jeremy_WeDidSomeCodingAtOurSchoolToo_TAKE1.mp3",
        "5_Viviana_WeWerePartners.mp3",
        "6_Jeremy_GoodLuck_TAKE1.mp3"];

    audioTimes = [1,4.5, 4, 2, 3, 4, 2];

    futureImages = [11,16, 9, 12, 8, 15, 10, 11];

    speakerHistory = [];
    futureSpeaker = ['f','v', 'j','v','j','v','j'];

    /* Conversation 2 */

    futureConversation2 = ["Jeremy, we did debugging in school too, right?",
        "Yeah, we did.",
        "I remember we couldn’t figure out that one activity, but we eventually got it."];

    futureAudio2 = ["1_Viviana_JeremyWeDidDebuggingInSchool.mp3",
        "2_Jeremy_YeahWeDid_TAKE1.mp3",
        "3_Jeremy_IRememberWeCouldnt_TAKE1.mp3"];

    audioTimes2=[3,3,5];

    futureImages2 = [4,3,2,11];

    futureSpeaker2 = ['v', 'j','j'];

    /* Conversation 3 */

    futureConversation3 = ["",
        "Aagh. The sprite\'s not jumping.",
        "O yeah. I think we need to change the \'y\' position.",
        "But, why?",
        "'Cause that will make it move up and down.",
        "Oh that actually worked!",
        "We’re so good at this!"];

    futureAudio3 = [null,
        "4_Jeremy_AghTheSpritesNotJumping_TAKE1.mp3",
        "5_Viviana_IThinkWeNeedToChangeTheYPosition.mp3",
        "6_Jeremy_ButWhy_TAKE1.mp3",
        "7_Viviana_CauseThatWillMakeItMoveUpAndDown.mp3",
        "8_Jeremy_OhThatActuallyWorked_TAKE2.mp3",
        "9_Viviana_WeAreSoGoodAtThis.mp3"];

    audioTimes3=[4,3,4,2,4,3,6];

    futureImages3 = [48,24,37,29,33,19,19,11];

    futureSpeaker3 = ['v','j','v','j','v','j','v'];

    setTimeout(function(){SnapActions.restartAgent()},3000);
    console.log("replay status is " + this.conversationReplay);
}

IDE_Morph.prototype.relayConversation = function () {
    this.conversationPause = ! this.conversationPause;
};

IDE_Morph.prototype.selectSprite = function (sprite) {
    if (this.currentSprite && this.currentSprite.scripts.focus) {
        this.currentSprite.scripts.focus.stopEditing();
    }

    this.currentSprite = sprite;
    this.createPalette();
    this.createSpriteBar();
    this.createSpriteEditor();
    this.corral.refresh();
    this.fixLayout('selectSprite');
    this.currentSprite.scripts.fixMultiArgs();
};

// IDE_Morph retina display support

IDE_Morph.prototype.toggleRetina = function () {
    if (isRetinaEnabled()) {
        disableRetinaSupport();
    } else {
        enableRetinaSupport();
    }
    this.world().fillPage();
    IDE_Morph.prototype.scriptsPaneTexture = this.scriptsTexture();
    this.stage.clearPenTrails();
    this.drawNew();
    this.refreshIDE();
};

// IDE_Morph skins

IDE_Morph.prototype.defaultDesign = function () {
    this.setDefaultDesign();
    this.refreshIDE();
    this.removeSetting('design');
};

IDE_Morph.prototype.flatDesign = function () {
    this.setFlatDesign();
    this.refreshIDE();
    this.saveSetting('design', 'flat');
};

IDE_Morph.prototype.refreshIDE = function () {
    var projectData;

    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(this.stage);
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(this.stage);
    }
    SpriteMorph.prototype.initBlocks();
    this.buildPanes();
    this.fixLayout();
    if (this.loadNewProject) {
        SnapActions.openProject();
    } else {
        SnapUndo.reset();
        this.openProjectString(projectData);
    }
};

// IDE_Morph settings persistance

IDE_Morph.prototype.applySavedSettings = function () {
    var design = this.getSetting('design'),
        zoom = this.getSetting('zoom'),
        language = this.getSetting('language'),
        click = this.getSetting('click'),
        longform = this.getSetting('longform'),
        longurls = this.getSetting('longurls'),
        plainprototype = this.getSetting('plainprototype'),
        keyboard = this.getSetting('keyboard'),
        tables = this.getSetting('tables'),
        tableLines = this.getSetting('tableLines'),
        autoWrapping = this.getSetting('autowrapping');

    // design
    if (design === 'flat') {
        this.setFlatDesign();
    } else {
        this.setDefaultDesign();
    }

    // blocks zoom
    if (zoom) {
        SyntaxElementMorph.prototype.setScale(Math.min(zoom, 12));
        CommentMorph.prototype.refreshScale();
        SpriteMorph.prototype.initBlocks();
    }

    // language
    if (language && language !== 'en') {
        this.userLanguage = language;
    } else {
        this.userLanguage = null;
    }

    //  click
    if (click && !BlockMorph.prototype.snapSound) {
        BlockMorph.prototype.toggleSnapSound();
    }

    // long form
    if (longform) {
        InputSlotDialogMorph.prototype.isLaunchingExpanded = true;
    }

    // project data in URLs
    if (longurls) {
        this.projectsInURLs = true;
    } else {
        this.projectsInURLs = false;
    }

    // keyboard editing
    if (keyboard === 'false') {
        ScriptsMorph.prototype.enableKeyboard = false;
    } else {
        ScriptsMorph.prototype.enableKeyboard = true;
    }

    // tables
    if (tables === 'false') {
        List.prototype.enableTables = false;
    } else {
        List.prototype.enableTables = true;
    }

    // tableLines
    if (tableLines) {
        TableMorph.prototype.highContrast = true;
    } else {
        TableMorph.prototype.highContrast = false;
    }

    // nested auto-wrapping
    if (autoWrapping === 'false') {
        ScriptsMorph.prototype.enableNestedAutoWrapping = false;
    } else {
        ScriptsMorph.prototype.enableNestedAutoWrapping = true;
    }

    // plain prototype labels
    if (plainprototype) {
        BlockLabelPlaceHolderMorph.prototype.plainLabel = true;
    }
};

IDE_Morph.prototype.saveSetting = function (key, value) {
    if (!this.savingPreferences) {
        return;
    }
    if (localStorage) {
        localStorage['-snap-setting-' + key] = value;
    }
};

IDE_Morph.prototype.getSetting = function (key) {
    if (localStorage) {
        return localStorage['-snap-setting-' + key];
    }
    return null;
};

IDE_Morph.prototype.removeSetting = function (key) {
    if (localStorage) {
        delete localStorage['-snap-setting-' + key];
    }
};

IDE_Morph.prototype.switchTasks = function() {
    subTaskIndex++;
    this.createSpriteBar();
    this.fixLayout();
}

// IDE_Morph sprite list access

IDE_Morph.prototype.addNewSprite = function () {
    var sprite = new SpriteMorph(this.globalVariables),
        rnd = Process.prototype.reportRandom;

    sprite.name = this.newSpriteName(sprite.name);
    sprite.setCenter(this.stage.center());
    sprite.parent = this.stage;

    // randomize sprite properties
    sprite.setHue(rnd.call(this, 0, 100));
    sprite.setBrightness(rnd.call(this, 50, 100));
    sprite.turn(0);
    sprite.setXPosition(rnd.call(this, -220, 220));
    sprite.setYPosition(rnd.call(this, -160, 160));

    return SnapActions.addSprite(sprite);
};

IDE_Morph.prototype.paintNewSprite = function () {
    var sprite = new SpriteMorph(this.globalVariables),
        cos = new Costume(),
        myself = this,
        opts,
        name;

    name = this.newSpriteName(sprite.name);

    cos.edit(
        this.world(),
        null,
        true,
        nop,  // No need to do anything special on cancel
        function () {
            cos.shrinkWrap();
            sprite.parent = myself.stage;
            sprite.addCostume(cos);
            sprite.wearCostume(cos);
            sprite.gotoXY(0, 0);
            SnapActions.addSprite(sprite);
        }
    );
};

IDE_Morph.prototype.duplicateSprite = function (sprite) {
    var duplicate = sprite.fullCopy();

    duplicate.appearIn(this);
    return duplicate;
};

IDE_Morph.prototype.removeSprite = function (sprite) {
    var idx, myself = this;
    sprite.parts.forEach(function (part) {myself.removeSprite(part); });
    idx = this.sprites.asArray().indexOf(sprite) + 1;
    this.stage.threads.stopAllForReceiver(sprite);
    sprite.corpsify();
    sprite.destroy();
    this.stage.watchers().forEach(function (watcher) {
        if (watcher.object() === sprite) {
            watcher.destroy();
        }
    });
    if (idx > 0) {
        this.sprites.remove(idx);
    }
    this.createCorral();
    this.fixLayout();
    this.currentSprite = detect(
        this.stage.children,
        function (morph) {return morph instanceof SpriteMorph; }
    ) || this.stage;

    this.selectSprite(this.currentSprite);
};

IDE_Morph.prototype.newSpriteName = function (name, ignoredSprite) {
    var ix = name.indexOf('('),
        stem = (ix < 0) ? name : name.substring(0, ix),
        count = 1,
        newName = stem,
        all = this.sprites.asArray().concat(this.stage).filter(
            function (each) {return each !== ignoredSprite; }
        ).map(
            function (each) {return each.name; }
        );
    while (contains(all, newName)) {
        count += 1;
        newName = stem + '(' + count + ')';
    }
    return newName;
};

// IDE_Morph menus

IDE_Morph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    // menu.addItem('help', 'nop');
    return menu;
};

IDE_Morph.prototype.snapMenu = function () {
    var menu,
        myself = this,
        world = this.world();

    menu = new MenuMorph(this);
    menu.addItem('About...', 'aboutSnap');
    menu.addLine();
    menu.addItem(
        'Reference manual',
        function () {
            var url = myself.resourceURL('help', 'SnapManual.pdf');
            window.open(url, 'SnapReferenceManual');
        }
    );
    menu.addItem(
        'Snap! website',
        function () {
            window.open('http://snap.berkeley.edu/', 'SnapWebsite');
        }
    );
    menu.addItem(
        'Download source',
        function () {
            window.open(
                'http://snap.berkeley.edu/snapsource/snap.zip',
                'SnapSource'
            );
        }
    );
    if (world.isDevMode) {
        menu.addLine();
        menu.addItem(
            'Switch back to user mode',
            'switchToUserMode',
            'disable deep-Morphic\ncontext menus'
            + '\nand show user-friendly ones',
            new Color(0, 100, 0)
        );
    } else if (world.currentKey === 16) { // shift-click
        menu.addLine();
        menu.addItem(
            'Switch to dev mode',
            'switchToDevMode',
            'enable Morphic\ncontext menus\nand inspectors,'
            + '\nnot user-friendly!',
            new Color(100, 0, 0)
        );
    }
    menu.popup(world, this.logo.bottomLeft());
};

IDE_Morph.prototype.cloudMenu = function () {
    var menu,
        myself = this,
        world = this.world(),
        shiftClicked = (world.currentKey === 16);

    menu = new MenuMorph(this);
    if (shiftClicked) {
        menu.addItem(
            'url...',
            'setCloudURL',
            null,
            new Color(100, 0, 0)
        );
        menu.addLine();
    }
    if (!SnapCloud.username) {
        menu.addItem(
            'Login...',
            'initializeCloud'
        );
        menu.addItem(
            'Signup...',
            'createCloudAccount'
        );
        menu.addItem(
            'Reset Password...',
            'resetCloudPassword'
        );
        if (SnapActions.isCollaborating() && SnapActions.sessionId) {
            menu.addLine();
            menu.addItem(
                'Collaboration url...',
                'promptCollaboration'
            );
        }
    } else {
        menu.addItem(
            localize('Logout') + ' ' + SnapCloud.username,
            'logout'
        );
        menu.addItem(
            'Change Password...',
            'changeCloudPassword'
        );
    }
    if (shiftClicked) {
        menu.addLine();
        menu.addItem(
            'export project media only...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectMedia(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectMedia(name);
                    }, null, 'exportProject');
                }
            },
            null,
            this.hasChangedMedia ? new Color(100, 0, 0) : new Color(0, 100, 0)
        );
        menu.addItem(
            'export project without media...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectNoMedia(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectNoMedia(name);
                    }, null, 'exportProject');
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addItem(
            'export project as cloud data...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectAsCloudData(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectAsCloudData(name);
                    }, null, 'exportProject');
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addLine();
        menu.addItem(
            'open shared project from cloud...',
            function () {
                myself.prompt('Author name…', function (usr) {
                    myself.prompt('Project name...', function (prj) {
                        var id = 'Username=' +
                            encodeURIComponent(usr.toLowerCase()) +
                            '&ProjectName=' +
                            encodeURIComponent(prj);
                        myself.showMessage(
                            'Fetching project\nfrom the cloud...'
                        );
                        SnapCloud.getPublicProject(
                            id,
                            function (projectData) {
                                var msg;
                                if (!Process.prototype.isCatchingErrors) {
                                    window.open(
                                        'data:text/xml,' + projectData
                                    );
                                }
                                myself.nextSteps([
                                    function () {
                                        msg = myself.showMessage(
                                            'Opening project...'
                                        );
                                    },
                                    function () {nop(); }, // yield (Chrome)
                                    function () {
                                        SnapActions.openProject(projectData)
                                            .then(function() {
                                                msg.destroy();
                                            });
                                    }
                                ]);
                            },
                            myself.cloudError()
                        );

                    }, null, 'project');
                }, null, 'project');
            },
            null,
            new Color(100, 0, 0)
        );
    }

    return menu;
};

IDE_Morph.prototype.settingsMenu = function () {
    var menu,
        stage = this.stage,
        world = this.world(),
        myself = this,
        shiftClicked = (world.currentKey === 16);

    function addPreference(label, toggle, test, onHint, offHint, hide) {
        var on = '\u2611 ',
            off = '\u2610 ';
        if (!hide || shiftClicked) {
            menu.addItem(
                (test ? on : off) + localize(label),
                toggle,
                test ? onHint : offHint,
                hide ? new Color(100, 0, 0) : null
            );
        }
    }

    menu = new MenuMorph(this);
    menu.addItem('Language...', 'languageMenu');
    menu.addItem(
        'Zoom blocks...',
        'userSetBlocksScale'
    );
    menu.addItem(
        'Stage size...',
        'userSetStageSize'
    );
    if (shiftClicked) {
        menu.addItem(
            'Dragging threshold...',
            'userSetDragThreshold',
            'specify the distance the hand has to move\n' +
            'before it picks up an object',
            new Color(100, 0, 0)
        );
    }
    menu.addLine();
    /*
    addPreference(
        'JavaScript',
        function () {
            Process.prototype.enableJS = !Process.prototype.enableJS;
            myself.currentSprite.blocksCache.operators = null;
            myself.currentSprite.paletteCache.operators = null;
            myself.refreshPalette();
        },
        Process.prototype.enableJS,
        'uncheck to disable support for\nnative JavaScript functions',
        'check to support\nnative JavaScript functions'
    );
    */
    if (isRetinaSupported()) {
        addPreference(
            'Retina display support',
            'toggleRetina',
            isRetinaEnabled(),
            'uncheck for lower resolution,\nsaves computing resources',
            'check for higher resolution,\nuses more computing resources'
        );
    }
    addPreference(
        'Blurred shadows',
        'toggleBlurredShadows',
        useBlurredShadows,
        'uncheck to use solid drop\nshadows and highlights',
        'check to use blurred drop\nshadows and highlights',
        true
    );
    addPreference(
        'Zebra coloring',
        'toggleZebraColoring',
        BlockMorph.prototype.zebraContrast,
        'uncheck to disable alternating\ncolors for nested block',
        'check to enable alternating\ncolors for nested blocks',
        true
    );
    addPreference(
        'Dynamic input labels',
        'toggleDynamicInputLabels',
        SyntaxElementMorph.prototype.dynamicInputLabels,
        'uncheck to disable dynamic\nlabels for variadic inputs',
        'check to enable dynamic\nlabels for variadic inputs',
        true
    );
    addPreference(
        'Prefer empty slot drops',
        'togglePreferEmptySlotDrops',
        ScriptsMorph.prototype.isPreferringEmptySlots,
        'uncheck to allow dropped\nreporters to kick out others',
        'settings menu prefer empty slots hint',
        true
    );
    addPreference(
        'Long form input dialog',
        'toggleLongFormInputDialog',
        InputSlotDialogMorph.prototype.isLaunchingExpanded,
        'uncheck to use the input\ndialog in short form',
        'check to always show slot\ntypes in the input dialog'
    );
    addPreference(
        'Plain prototype labels',
        'togglePlainPrototypeLabels',
        BlockLabelPlaceHolderMorph.prototype.plainLabel,
        'uncheck to always show (+) symbols\nin block prototype labels',
        'check to hide (+) symbols\nin block prototype labels'
    );
    addPreference(
        'Virtual keyboard',
        'toggleVirtualKeyboard',
        MorphicPreferences.useVirtualKeyboard,
        'uncheck to disable\nvirtual keyboard support\nfor mobile devices',
        'check to enable\nvirtual keyboard support\nfor mobile devices',
        true
    );
    addPreference(
        'Input sliders',
        'toggleInputSliders',
        MorphicPreferences.useSliderForInput,
        'uncheck to disable\ninput sliders for\nentry fields',
        'check to enable\ninput sliders for\nentry fields'
    );
    if (MorphicPreferences.useSliderForInput) {
        addPreference(
            'Execute on slider change',
            'toggleSliderExecute',
            ArgMorph.prototype.executeOnSliderEdit,
            'uncheck to suppress\nrunning scripts\nwhen moving the slider',
            'check to run\nthe edited script\nwhen moving the slider'
        );
    }
    addPreference(
        'Clicking sound',
        function () {
            BlockMorph.prototype.toggleSnapSound();
            if (BlockMorph.prototype.snapSound) {
                myself.saveSetting('click', true);
            } else {
                myself.removeSetting('click');
            }
        },
        BlockMorph.prototype.snapSound,
        'uncheck to turn\nblock clicking\nsound off',
        'check to turn\nblock clicking\nsound on'
    );
    addPreference(
        'Animations',
        function () {myself.isAnimating = !myself.isAnimating; },
        myself.isAnimating,
        'uncheck to disable\nIDE animations',
        'check to enable\nIDE animations',
        true
    );
    addPreference(
        'Turbo mode',
        'toggleFastTracking',
        this.stage.isFastTracked,
        'uncheck to run scripts\nat normal speed',
        'check to prioritize\nscript execution'
    );
    addPreference(
        'Cache Inputs',
        function () {
            BlockMorph.prototype.isCachingInputs =
                !BlockMorph.prototype.isCachingInputs;
        },
        BlockMorph.prototype.isCachingInputs,
        'uncheck to stop caching\ninputs (for debugging the evaluator)',
        'check to cache inputs\nboosts recursion',
        true
    );
    addPreference(
        'Rasterize SVGs',
        function () {
            MorphicPreferences.rasterizeSVGs =
                !MorphicPreferences.rasterizeSVGs;
        },
        MorphicPreferences.rasterizeSVGs,
        'uncheck for smooth\nscaling of vector costumes',
        'check to rasterize\nSVGs on import',
        true
    );
    addPreference(
        'Flat design',
        function () {
            if (MorphicPreferences.isFlat) {
                return myself.defaultDesign();
            }
            myself.flatDesign();
        },
        MorphicPreferences.isFlat,
        'uncheck for default\nGUI design',
        'check for alternative\nGUI design',
        false
    );
    addPreference(
        'Nested auto-wrapping',
        function () {
            ScriptsMorph.prototype.enableNestedAutoWrapping =
                !ScriptsMorph.prototype.enableNestedAutoWrapping;
            if (ScriptsMorph.prototype.enableNestedAutoWrapping) {
                myself.removeSetting('autowrapping');
            } else {
                myself.saveSetting('autowrapping', false);
            }
        },
        ScriptsMorph.prototype.enableNestedAutoWrapping,
        'uncheck to confine auto-wrapping\nto top-level block stacks',
        'check to enable auto-wrapping\ninside nested block stacks',
        false
    );
    addPreference(
        'Project URLs',
        function () {
            myself.projectsInURLs = !myself.projectsInURLs;
            if (myself.projectsInURLs) {
                myself.saveSetting('longurls', true);
            } else {
                myself.removeSetting('longurls');
            }
        },
        myself.projectsInURLs,
        'uncheck to disable\nproject data in URLs',
        'check to enable\nproject data in URLs',
        true
    );
    addPreference(
        'Sprite Nesting',
        function () {
            SpriteMorph.prototype.enableNesting =
                !SpriteMorph.prototype.enableNesting;
        },
        SpriteMorph.prototype.enableNesting,
        'uncheck to disable\nsprite composition',
        'check to enable\nsprite composition',
        true
    );
    addPreference(
        'First-Class Sprites',
        function () {
            SpriteMorph.prototype.enableFirstClass =
                !SpriteMorph.prototype.enableFirstClass;
            myself.currentSprite.blocksCache.sensing = null;
            myself.currentSprite.paletteCache.sensing = null;
            myself.refreshPalette();
        },
        SpriteMorph.prototype.enableFirstClass,
        'uncheck to disable support\nfor first-class sprites',
        'check to enable support\n for first-class sprite',
        true
    );
    addPreference(
        'Keyboard Editing',
        function () {
            ScriptsMorph.prototype.enableKeyboard =
                !ScriptsMorph.prototype.enableKeyboard;
            if (ScriptsMorph.prototype.enableKeyboard) {
                myself.removeSetting('keyboard');
            } else {
                myself.saveSetting('keyboard', false);
            }
        },
        ScriptsMorph.prototype.enableKeyboard,
        'uncheck to disable\nkeyboard editing support',
        'check to enable\nkeyboard editing support',
        false
    );
    addPreference(
        'Table support',
        function () {
            List.prototype.enableTables =
                !List.prototype.enableTables;
            if (List.prototype.enableTables) {
                myself.removeSetting('tables');
            } else {
                myself.saveSetting('tables', false);
            }
        },
        List.prototype.enableTables,
        'uncheck to disable\nmulti-column list views',
        'check for multi-column\nlist view support',
        false
    );
    if (List.prototype.enableTables) {
        addPreference(
            'Table lines',
            function () {
                TableMorph.prototype.highContrast =
                    !TableMorph.prototype.highContrast;
                if (TableMorph.prototype.highContrast) {
                    myself.saveSetting('tableLines', true);
                } else {
                    myself.removeSetting('tableLines');
                }
            },
            TableMorph.prototype.highContrast,
            'uncheck for less contrast\nmulti-column list views',
            'check for higher contrast\ntable views',
            false
        );
    }
    addPreference(
        'Live coding support',
        function () {
            Process.prototype.enableLiveCoding =
                !Process.prototype.enableLiveCoding;
        },
        Process.prototype.enableLiveCoding,
        'EXPERIMENTAL! uncheck to disable live\ncustom control structures',
        'EXPERIMENTAL! check to enable\n live custom control structures',
        true
    );
    addPreference(
        'Visible stepping',
        'toggleSingleStepping',
        Process.prototype.enableSingleStepping,
        'uncheck to turn off\nvisible stepping',
        'check to turn on\n visible stepping (slow)',
        false
    );
    if (SnapActions.supportsCollaboration !== false) {
        addPreference(
            'Collaborative editing',
            'toggleCollaborativeEditing',
            SnapActions.isCollaborating(),
            'uncheck to disable Google Docs-style collaboration',
            'check to enable Google Docs-style collaboration',
            false
        );
    }
    addPreference(
        'Replay Mode',
        function() {
            if (myself.isReplayMode) {  // exiting replay mode

                if (myself.isPreviousVersion()) {
                    myself.confirm(
                        'Exiting replay mode now will revert the project to\n' +
                        'the current point in history (losing any unapplied ' +
                        'changes)\n\nAre you sure you want to exit replay mode?',
                        'Exit Replay Mode?',
                        function () {
                            myself.exitReplayMode();
                        }
                    );
                    return;
                }
                return myself.exitReplayMode();
            }
            // entering replay mode
            if (SnapUndo.allEvents.length < 2) {
                return myself.showMessage('Nothing to replay!', 2);
            }
            if (SnapActions.isCollaborating()) {
                this.confirm(
                    'Cannot enter replay mode while collaborating. \nWould you ' +
                    'like to disable collaboration and enter replay mode?',
                    'Disable Collaboration?',
                    function () {
                        SnapActions.disableCollaboration();
                        myself.replayEvents();
                    }
                );
            } else {
                myself.replayEvents();
            }
        },
        myself.isReplayMode,
        'uncheck to disable replay mode',
        'check to enable replay mode',
        false
    );
    addPreference(
        'Save replay history',
        function() {
            SnapSerializer.prototype.isSavingHistory = !SnapSerializer.prototype.isSavingHistory;
        },
        SnapSerializer.prototype.isSavingHistory,
        'uncheck to only save project',
        'check to save replay with project',
        false
    );
    menu.addLine(); // everything below this line is stored in the project
    addPreference(
        'Thread safe scripts',
        function () {stage.isThreadSafe = !stage.isThreadSafe; },
        this.stage.isThreadSafe,
        'uncheck to allow\nscript reentrance',
        'check to disallow\nscript reentrance'
    );
    addPreference(
        'Prefer smooth animations',
        'toggleVariableFrameRate',
        StageMorph.prototype.frameRate,
        'uncheck for greater speed\nat variable frame rates',
        'check for smooth, predictable\nanimations across computers',
        true
    );
    addPreference(
        'Flat line ends',
        function () {
            SpriteMorph.prototype.useFlatLineEnds =
                !SpriteMorph.prototype.useFlatLineEnds;
        },
        SpriteMorph.prototype.useFlatLineEnds,
        'uncheck for round ends of lines',
        'check for flat ends of lines'
    );
    addPreference(
        'Codification support',
        function () {
            StageMorph.prototype.enableCodeMapping =
                !StageMorph.prototype.enableCodeMapping;
            myself.currentSprite.blocksCache.variables = null;
            myself.currentSprite.paletteCache.variables = null;
            myself.refreshPalette();
        },
        StageMorph.prototype.enableCodeMapping,
        'uncheck to disable\nblock to text mapping features',
        'check for block\nto text mapping features',
        false
    );
    addPreference(
        'Inheritance support',
        function () {
            StageMorph.prototype.enableInheritance =
                !StageMorph.prototype.enableInheritance;
            myself.currentSprite.blocksCache.variables = null;
            myself.currentSprite.paletteCache.variables = null;
            myself.refreshPalette();
        },
        StageMorph.prototype.enableInheritance,
        'uncheck to disable\nsprite inheritance features',
        'check for sprite\ninheritance features',
        false
    );
    addPreference(
        'Persist linked sublist IDs',
        function () {
            StageMorph.prototype.enableSublistIDs =
                !StageMorph.prototype.enableSublistIDs;
        },
        StageMorph.prototype.enableSublistIDs,
        'uncheck to disable\nsaving linked sublist identities',
        'check to enable\nsaving linked sublist identities',
        true
    );
    return menu;
};

IDE_Morph.prototype.projectMenu = function () {
    var menu,
        myself = this,
        world = this.world(),
        graphicsName = this.currentSprite instanceof SpriteMorph ?
            'Costumes' : 'Backgrounds',
        shiftClicked = (world.currentKey === 16);

    menu = new MenuMorph(this);
    menu.addItem('Project notes...', 'editProjectNotes');
    menu.addLine();
    menu.addPair('New', 'createNewProject', '^N');
    menu.addPair('Open...', 'openProjectsBrowser', '^O');
    menu.addPair('Save', "save", '^S');
    menu.addItem('Save As...', function() {
        if (myself.isPreviousVersion()) {
            return myself.showMessage('Please exit replay mode before saving');
        }

        myself.saveProjectsBrowser();
    });
    if (shiftClicked) {
        menu.addItem(
            localize('Replay events from file'),
            function() {
                var inp = document.createElement('input');
                if (SnapUndo.allEvents.length > 1) {
                    myself.newProject();
                }

                if (myself.filePicker) {
                    document.body.removeChild(myself.filePicker);
                    myself.filePicker = null;
                }
                inp.type = 'file';
                inp.style.color = "transparent";
                inp.style.backgroundColor = "transparent";
                inp.style.border = "none";
                inp.style.outline = "none";
                inp.style.position = "absolute";
                inp.style.top = "0px";
                inp.style.left = "0px";
                inp.style.width = "0px";
                inp.style.height = "0px";
                inp.addEventListener(
                    'change',
                    function () {
                        var reader = new FileReader();
                        document.body.removeChild(inp);
                        myself.filePicker = null;

                        reader.onloadend = function(result) {
                            return myself.loadReplayFromXml(result.target.result);
                        };
                        reader.readAsText(inp.files[0]);
                    },
                    false
                );
                document.body.appendChild(inp);
                myself.filePicker = inp;
                inp.click();
            },
            'Load project replay from the beginning',
            new Color(100, 0, 0)
        );
    }
    menu.addLine();
    menu.addItem(
        'Import...',
        function () {
            var inp = document.createElement('input');
            if (myself.filePicker) {
                document.body.removeChild(myself.filePicker);
                myself.filePicker = null;
            }
            inp.type = 'file';
            inp.style.color = "transparent";
            inp.style.backgroundColor = "transparent";
            inp.style.border = "none";
            inp.style.outline = "none";
            inp.style.position = "absolute";
            inp.style.top = "0px";
            inp.style.left = "0px";
            inp.style.width = "0px";
            inp.style.height = "0px";
            inp.style.display = "none";
            inp.addEventListener(
                "change",
                function () {
                    document.body.removeChild(inp);
                    myself.filePicker = null;
                    world.hand.processDrop(inp.files);
                },
                false
            );
            document.body.appendChild(inp);
            myself.filePicker = inp;
            inp.click();
        },
        'file menu import hint' // looks up the actual text in the translator
    );

    if (shiftClicked) {
        menu.addItem(
            localize(
                'Export project...') + ' ' + localize('(in a new window)'
            ),
            function () {
                if (myself.projectName) {
                    myself.exportProject(myself.projectName, shiftClicked);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        // false - override the shiftClick setting to use XML
                        // true - open XML in a new tab
                        myself.exportProject(name, false, true);
                    }, null, 'exportProject');
                }
            },
            'show project data as XML\nin a new browser window',
            new Color(100, 0, 0)
        );
        menu.addItem(
            localize('Export project without history...'),
            function () {
                var savingHistory = myself.serializer.isSavingHistory;
                if (myself.projectName) {
                    myself.serializer.isSavingHistory = false;
                    myself.exportProject(myself.projectName, shiftClicked);
                    myself.serializer.isSavingHistory = savingHistory;
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.serializer.isSavingHistory = false;
                        myself.exportProject(name, shiftClicked);
                        myself.serializer.isSavingHistory = savingHistory;
                    }, null, 'exportProject');
                }
            },
            null,
            new Color(100, 0, 0)
        );
    }
    menu.addItem(
        shiftClicked ?
            'Export project as plain text...' : 'Export project...',
        function () {
            if (myself.projectName) {
                myself.exportProject(myself.projectName, shiftClicked);
            } else {
                myself.prompt('Export Project As...', function (name) {
                    myself.exportProject(name, shiftClicked);
                }, null, 'exportProject');
            }
        },
        'save project data as XML\nto your downloads folder',
        shiftClicked ? new Color(100, 0, 0) : null
    );

    if (this.stage.globalBlocks.length) {
        menu.addItem(
            'Export blocks...',
            'exportGlobalBlocks',
            'show global custom block definitions as XML' +
            '\nin a new browser window'
        );
        menu.addItem(
            'Unused blocks...',
            function () {myself.removeUnusedBlocks(); },
            'find unused global custom blocks' +
            '\nand remove their definitions'
        );
    }

    menu.addItem(
        'Export summary...',
        function () {myself.exportProjectSummary(); },
        'open a new browser browser window\n with a summary of this project'
    );

    if (shiftClicked) {
        menu.addItem(
            'Export summary with drop-shadows...',
            function () {myself.exportProjectSummary(true); },
            'open a new browser browser window' +
            '\nwith a summary of this project' +
            '\nwith drop-shadows on all pictures.' +
            '\nnot supported by all browsers',
            new Color(100, 0, 0)
        );
        menu.addItem(
            'Export all scripts as pic...',
            function () {myself.exportScriptsPicture(); },
            'show a picture of all scripts\nand block definitions',
            new Color(100, 0, 0)
        );
    }

    menu.addLine();
    menu.addItem(
        'Import tools',
        function () {
            myself.getURL(
                myself.resourceURL('tools.xml'),
                function (txt) {
                    myself.droppedText(txt, 'tools');
                }
            );
        },
        'load the official library of\npowerful blocks'
    );
    menu.addItem(
        'Libraries...',
        function() {
            myself.getURL(
                myself.resourceURL('libraries', 'LIBRARIES'),
                function (txt) {
                    var libraries = myself.parseResourceFile(txt);
                    new LibraryImportDialogMorph(myself, libraries).popUp();
                }
            );
        },
        'Select categories of additional blocks to add to this project.'
    );

    menu.addItem(
        localize(graphicsName) + '...',
        function () {
            myself.importMedia(graphicsName);
        },
        'Select a costume from the media library'
    );
    menu.addItem(
        localize('Sounds') + '...',
        function () {
            myself.importMedia('Sounds');
        },
        'Select a sound from the media library'
    );

    return menu;
};

IDE_Morph.prototype.replayEvents = function (actions, atEnd) {
    atEnd = !!atEnd;

    if (!actions) {  // If no actions, use current session
        atEnd = true;
        actions = JSON.parse(JSON.stringify(SnapUndo.allEvents));
    }
    this.replayControls.enable();
    this.replayControls.setActions(actions, atEnd);
    this.isReplayMode = true;

    // store the state of the undo queues (to detect the changed ones after)
    this.preReplayUndoState = {};
    var queueIds = SnapUndo.allQueueIds();
    for (var i = queueIds.length; i--;) {
        this.preReplayUndoState[queueIds[i]] = SnapUndo.undoCount[queueIds[i]];
    }
};

IDE_Morph.prototype.exitReplayMode = function () {
    if (this.isReplayMode) {
        this.isReplayMode = false;
        // only trim the undo queues for the queues that have changed
        var myself = this,
            allIds = SnapUndo.allQueueIds(),
            changedIds;

        changedIds = allIds.filter(function(id) {
            return myself.preReplayUndoState[id] !== SnapUndo.undoCount[id];
        });

        changedIds.forEach(function(id) {
            SnapUndo.trim(id);
        });

        SnapUndo.allEvents = this.replayControls.getCurrentHistory();
        this.activeEditor.onSetActive();
        this.replayControls.disable();
    }
};

IDE_Morph.prototype.resourceURL = function () {
    // Take in variadic inputs that represent an a nested folder structure.
    // Method can be easily overridden if running in a custom location.
    // Default Snap! simply returns a path (relative to snap.html)
    var args = Array.prototype.slice.call(arguments, 0);
    return args.join('/');
};

IDE_Morph.prototype.getMediaList = function (dirname, callback) {
    // Invoke the given callback with a list of files in a directory
    // based on the contents file.
    // If no callback is specified, synchronously return the list of files
    // Note: Synchronous fetching has been deprecated and should be switched
    var url = this.resourceURL(dirname, dirname.toUpperCase()),
        async = callback instanceof Function,
        myself = this,
        data;

    function alphabetically(x, y) {
        return x.name.toLowerCase() < y.name.toLowerCase() ? -1 : 1;
    }

    if (async) {
        this.getURL(
            url,
            function (txt) {
                var data = myself.parseResourceFile(txt);
                data.sort(alphabetically);
                callback.call(this, data);
            }
        );
    } else {
        data = this.parseResourceFile(this.getURL(url));
        data.sort(alphabetically);
        return data;
    }
};

IDE_Morph.prototype.parseResourceFile = function (text) {
    // A Resource File lists all the files that could be loaded in a submenu
    // Examples are libraries/LIBRARIES, Costumes/COSTUMES, etc
    // The file format is tab-delimited, with unix newlines:
    // file-name, Display Name, Help Text (optional)
    var parts,
        items = [];

    text.split('\n').map(function (line) {
        return line.trim();
    }).filter(function (line) {
        return line.length > 0;
    }).forEach(function (line) {
        parts = line.split('\t').map(function (str) { return str.trim(); });

        if (parts.length < 2) {return; }

        items.push({
            fileName: parts[0],
            name: parts[1],
            description: parts.length > 2 ? parts[2] : ''
        });
    });

    return items;
};

IDE_Morph.prototype.importMedia = function (folderName) {
    // open a dialog box letting the user browse available "built-in"
    // costumes, backgrounds or sounds
    var myself = this,
        msg = this.showMessage('Opening ' + folderName + '...');
    this.getMediaList(
        folderName,
        function (items) {
            msg.destroy();
            myself.popupMediaImportDialog(folderName, items);
        }
    );

};

IDE_Morph.prototype.popupMediaImportDialog = function (folderName, items) {
    // private - this gets called by importMedia() and creates
    // the actual dialog
    var dialog = new DialogBoxMorph().withKey('import' + folderName),
        frame = new ScrollFrameMorph(),
        selectedIcon = null,
        turtle = new SymbolMorph('turtle', 60),
        myself = this,
        world = this.world(),
        handle;

    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;
    frame.color = myself.groupColor;
    frame.fixLayout = nop;
    dialog.labelString = folderName;
    dialog.createLabel();
    dialog.addBody(frame);
    dialog.addButton('ok', 'Import');
    dialog.addButton('cancel', 'Close');

    dialog.ok = function () {
        if (selectedIcon) {
            if (selectedIcon.object instanceof Sound) {
                myself.droppedAudio(
                    selectedIcon.object.copy().audio,
                    selectedIcon.labelString
                );
            } else if (selectedIcon.object instanceof SVG_Costume) {
                myself.droppedSVG(
                    selectedIcon.object.contents,
                    selectedIcon.labelString
                );
            } else {
                myself.droppedImage(
                    selectedIcon.object.contents,
                    selectedIcon.labelString
                );
            }
        }
    };

    dialog.fixLayout = function () {
        var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
            x = 0,
            y = 0,
            fp, fw;
        this.buttons.fixLayout();
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            th + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height() - this.padding * 3 - th - this.buttons.height()
        ));
        fp = this.body.position();
        fw = this.body.width();
        frame.contents.children.forEach(function (icon) {
            icon.setPosition(fp.add(new Point(x, y)));
            x += icon.width();
            if (x + icon.width() > fw) {
                x = 0;
                y += icon.height();
            }
        });
        frame.contents.adjustBounds();
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    };

    items.forEach(function (item) {
        // Caution: creating very many thumbnails can take a long time!
        var url = myself.resourceURL(folderName, item.fileName),
            img = new Image(),
            suffix = url.slice(url.lastIndexOf('.') + 1).toLowerCase(),
            isSVG = suffix === 'svg' && !MorphicPreferences.rasterizeSVGs,
            isSound = contains(['wav', 'mp3'], suffix),
            cstTemplate,
            sndTemplate,
            icon;

        if (isSound) {
            sndTemplate = icon = new SoundIconMorph(
                new Sound(new Audio(), item.name),
                sndTemplate
            );
        } else {
            cstTemplate = icon = new CostumeIconMorph(
                new Costume(turtle.image, item.name),
                cstTemplate
            );
        }
        icon.isDraggable = false;
        icon.userMenu = nop;
        icon.action = function () {
            if (selectedIcon === icon) {return; }
            var prevSelected = selectedIcon;
            selectedIcon = icon;
            if (prevSelected) {prevSelected.refresh(); }
        };
        icon.doubleClickAction = dialog.ok;
        icon.query = function () {
            return icon === selectedIcon;
        };
        frame.addContents(icon);
        if (isSound) {
            icon.object.audio.onloadeddata = function () {
                icon.createThumbnail();
                icon.fixLayout();
                icon.refresh();
            };

            icon.object.audio.src = url;
            icon.object.audio.load();
        } else if (isSVG) {
            img.onload = function () {
                icon.object = new SVG_Costume(img, item.name);
                icon.refresh();
            };
            myself.getURL(
                url,
                function (txt) {
                    img.src = 'data:image/svg+xml;utf8,' +
                        encodeURIComponent(txt);
                }
            );
        } else {
            img.onload = function () {
                var canvas = newCanvas(new Point(img.width, img.height), true);
                canvas.getContext('2d').drawImage(img, 0, 0);
                icon.object = new Costume(canvas, item.name);
                icon.refresh();
            };
            img.src = url;
        }
    });
    dialog.popUp(world);
    dialog.setExtent(new Point(400, 300));
    dialog.setCenter(world.center());
    dialog.drawNew();

    handle = new HandleMorph(
        dialog,
        300,
        280,
        dialog.corner,
        dialog.corner
    );
};

// IDE_Morph menu actions

IDE_Morph.prototype.aboutSnap = function () {
    var dlg, aboutTxt, noticeTxt, creditsTxt, versions = '', translations,
        module, btn1, btn2, btn3, btn4, licenseBtn, translatorsBtn,
        world = this.world();

    aboutTxt = 'Snap! 4.0.10.2\nBuild Your Own Blocks\n\n'
        + 'Copyright \u24B8 2017 Jens M\u00F6nig and '
        + 'Brian Harvey\n'
        + 'jens@moenig.org, bh@cs.berkeley.edu\n\n'

        + 'Snap! is developed by the University of California, Berkeley\n'
        + '          with support from the National Science Foundation (NSF), '
        + 'MioSoft,          \n'
        + 'the Communications Design Group (CDG) at SAP Labs, and the\n'
        + 'Human Advancement Research Community (HARC) at YC Research.\n'

        + 'The design of Snap! is influenced and inspired by Scratch,\n'
        + 'from the Lifelong Kindergarten group at the MIT Media Lab\n\n'

        + 'for more information see http://snap.berkeley.edu\n'
        + 'and http://scratch.mit.edu';

    noticeTxt = localize('License')
        + '\n\n'
        + 'Snap! is free software: you can redistribute it and/or modify\n'
        + 'it under the terms of the GNU Affero General Public License as\n'
        + 'published by the Free Software Foundation, either version 3 of\n'
        + 'the License, or (at your option) any later version.\n\n'

        + 'This program is distributed in the hope that it will be useful,\n'
        + 'but WITHOUT ANY WARRANTY; without even the implied warranty of\n'
        + 'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n'
        + 'GNU Affero General Public License for more details.\n\n'

        + 'You should have received a copy of the\n'
        + 'GNU Affero General Public License along with this program.\n'
        + 'If not, see http://www.gnu.org/licenses/\n\n'

        + 'Want to use Snap! but scared by the open-source license?\n'
        + 'Get in touch with us, we\'ll make it work.';

    creditsTxt = localize('Contributors')
        + '\n\nNathan Dinsmore: Saving/Loading, Snap-Logo Design, '
        + '\ncountless bugfixes and optimizations'
        + '\nKartik Chandra: Paint Editor'
        + '\nMichael Ball: Time/Date UI, Library Import Dialog,'
        + '\ncountless bugfixes and optimizations'
        + '\nBartosz Leper: Retina Display Support'
        + '\nBernat Romagosa: Countless contributions'
        + '\n"Ava" Yuan Yuan, Dylan Servilla: Graphic Effects'
        + '\nKyle Hotchkiss: Block search design'
        + '\nBrian Broll: Many bugfixes and optimizations'
        + '\nIan Reynolds: UI Design, Event Bindings, '
        + 'Sound primitives'
        + '\nIvan Motyashov: Initial Squeak Porting'
        + '\nDavide Della Casa: Morphic Optimizations'
        + '\nAchal Dave: Web Audio'
        + '\nJoe Otto: Morphic Testing and Debugging';

    for (module in modules) {
        if (Object.prototype.hasOwnProperty.call(modules, module)) {
            versions += ('\n' + module + ' (' +
                modules[module] + ')');
        }
    }
    if (versions !== '') {
        versions = localize('current module versions:') + ' \n\n' +
            'morphic (' + morphicVersion + ')' +
            versions;
    }
    translations = localize('Translations') + '\n' + SnapTranslator.credits();

    dlg = new DialogBoxMorph();
    dlg.inform('About Snap', aboutTxt, world);
    btn1 = dlg.buttons.children[0];
    translatorsBtn = dlg.addButton(
        function () {
            dlg.body.text = translations;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Translators...'
    );
    btn2 = dlg.addButton(
        function () {
            dlg.body.text = aboutTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.hide();
            btn3.show();
            btn4.show();
            licenseBtn.show();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Back...'
    );
    btn2.hide();
    licenseBtn = dlg.addButton(
        function () {
            dlg.body.text = noticeTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'License...'
    );
    btn3 = dlg.addButton(
        function () {
            dlg.body.text = versions;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Modules...'
    );
    btn4 = dlg.addButton(
        function () {
            dlg.body.text = creditsTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            translatorsBtn.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Credits...'
    );
    translatorsBtn.hide();
    dlg.fixLayout();
    dlg.drawNew();
};

IDE_Morph.prototype.editProjectNotes = function () {
    var dialog = new DialogBoxMorph().withKey('projectNotes'),
        frame = new ScrollFrameMorph(),
        text = new TextMorph(this.projectNotes || ''),
        ok = dialog.ok,
        myself = this,
        size = 250,
        world = this.world();

    frame.padding = 6;
    frame.setWidth(size);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    text.setWidth(size - frame.padding * 2);
    text.setPosition(frame.topLeft().add(frame.padding));
    text.enableSelecting();
    text.isEditable = true;

    frame.setHeight(size);
    frame.fixLayout = nop;
    frame.edge = InputFieldMorph.prototype.edge;
    frame.fontSize = InputFieldMorph.prototype.fontSize;
    frame.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    frame.contrast = InputFieldMorph.prototype.contrast;
    frame.drawNew = InputFieldMorph.prototype.drawNew;
    frame.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    frame.addContents(text);
    text.drawNew();

    dialog.ok = function () {
        myself.projectNotes = text.text;
        ok.call(this);
    };

    dialog.justDropped = function () {
        text.edit();
    };

    dialog.labelString = 'Project Notes';
    dialog.createLabel();
    dialog.addBody(frame);
    frame.drawNew();
    dialog.addButton('ok', 'OK');
    dialog.addButton('cancel', 'Cancel');
    dialog.fixLayout();
    dialog.drawNew();
    dialog.popUp(world);
    dialog.setCenter(world.center());
    text.edit();
};

IDE_Morph.prototype.newProject = function () {
    this.source = SnapCloud.username ? 'cloud' : 'local';
    if (this.stage) {
        this.stage.destroy();
    }
    if (location.hash.substr(0, 6) !== '#lang:') {
        location.hash = '';
    }
    this.globalVariables = new VariableFrame();
    this.currentSprite = new SpriteMorph(this.globalVariables);
    this.sprites = new List([this.currentSprite]);
    StageMorph.prototype.dimensions = new Point(480, 360);
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    StageMorph.prototype.enableInheritance = false;
    StageMorph.prototype.enableSublistIDs = false;
    SpriteMorph.prototype.useFlatLineEnds = false;
    Process.prototype.enableLiveCoding = false;
    this.setProjectName('');
    this.projectNotes = '';
    this.createStage();
    this.add(this.stage);
    this.createCorral();
    this.selectSprite(this.stage.children[0]);
    this.fixLayout();
};

IDE_Morph.prototype.isPreviousVersion = function () {
    if (!this.isReplayMode) return false;

    var newHistoryLen = this.replayControls.actionIndex + 1,
        lostEventCount = SnapUndo.allEvents.filter(function(event) {
            return !event.isReplay;
        }).length - newHistoryLen;

    return lostEventCount > 0;
};

IDE_Morph.prototype.save = function () {
    if (this.isPreviousVersion()) {
        return this.showMessage('Please exit replay mode before saving');
    }

    if (this.source === 'examples') {
        this.source = 'local'; // cannot save to examples
    }
    if (this.projectName) {
        if (this.source === 'local') { // as well as 'examples'
            this.saveProject(this.projectName);
        } else { // 'cloud'
            this.saveProjectToCloud(this.projectName);
        }
    } else {
        this.saveProjectsBrowser();
    }
};

IDE_Morph.prototype.saveProject = function (name) {
    var myself = this;
    this.nextSteps([
        function () {
            myself.showMessage('Saving...');
        },
        function () {
            myself.rawSaveProject(name);
        }
    ]);
};

// Serialize a project and save to the browser.
IDE_Morph.prototype.rawSaveProject = function (name) {
    var str;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                localStorage['-snap-project-' + name]
                    = str = this.serializer.serialize(this.stage);
                this.setURL('#open:' + str);
                this.showMessage('Saved!', 1);
            } catch (err) {
                this.showMessage('Save failed: ' + err);
            }
        } else {
            localStorage['-snap-project-' + name]
                = str = this.serializer.serialize(this.stage);
            this.setURL('#open:' + str);
            this.showMessage('Saved!', 1);
        }
    }
};


IDE_Morph.prototype.exportProject = function (name, plain, newWindow) {
    // Export project XML, saving a file to disk
    // newWindow requests displaying the project in a new tab.
    var menu, str, dataPrefix;

    if (name) {
        var currentName = this.projectName;
        this.silentSetProjectName(name);
        dataPrefix = 'data:text/' + plain ? 'plain,' : 'xml,';
        try {
            menu = this.showMessage('Exporting');
            str = this.serializer.serialize(this.stage);
            this.setURL('#open:' + dataPrefix + encodeURIComponent(str));
            this.saveXMLAs(str, name, newWindow);
            menu.destroy();
            this.showMessage('Exported!', 1);
        } catch (err) {
            if (Process.prototype.isCatchingErrors) {
                this.showMessage('Export failed: ' + err);
            } else {
                throw err;
            }
        }
        this.silentSetProjectName(currentName);
    }
};

IDE_Morph.prototype.exportGlobalBlocks = function () {
    if (this.stage.globalBlocks.length > 0 || this.stage.deletableMessageNames().length) {
        new BlockExportDialogMorph(
            this.serializer,
            this.stage.globalBlocks,
            this.stage
        ).popUp(this.world());
    } else {
        this.inform(
            'Export blocks/msg types',
            'this project doesn\'t have any\n'
            + 'custom global blocks or message types yet'
        );
    }
};

IDE_Morph.prototype.removeUnusedBlocks = function () {
    var targets = this.sprites.asArray().concat([this.stage]),
        globalBlocks = this.stage.globalBlocks,
        unused = [],
        isDone = false,
        found;

    function scan() {
        return globalBlocks.filter(function (def) {
            if (contains(unused, def)) {return false; }
            return targets.every(function (each, trgIdx) {
                return !(each.usesBlockInstance(def, true, trgIdx, unused));
            });
        });
    }

    while (!isDone) {
        found = scan();
        if (found.length) {
            unused = unused.concat(found);
        } else {
            isDone = true;
        }
    }
    if (unused.length > 0) {
        new BlockRemovalDialogMorph(
            unused,
            this.stage
        ).popUp(this.world());
    } else {
        this.inform(
            'Remove unused blocks',
            'there are currently no unused\n'
            + 'global custom blocks in this project'
        );
    }
};

IDE_Morph.prototype.exportSprite = function (sprite) {
    var isSavingHistory = this.serializer.isSavingHistory,
        str;

    this.serializer.isSavingHistory = false;
    str = this.serializer.serialize(sprite.allParts());
    this.serializer.isSavingHistory = isSavingHistory;

    str = '<sprites app="'
        + this.serializer.app
        + '" version="'
        + this.serializer.version
        + '">'
        + str
        + '</sprites>';
    this.saveXMLAs(str, sprite.name);
};

IDE_Morph.prototype.exportScriptsPicture = function () {
    var pics = [],
        pic,
        padding = 20,
        w = 0,
        h = 0,
        y = 0,
        ctx;

    // collect all script pics
    this.sprites.asArray().forEach(function (sprite) {
        pics.push(sprite.image);
        pics.push(sprite.scripts.scriptsPicture());
        sprite.customBlocks.forEach(function (def) {
            pics.push(def.scriptsPicture());
        });
    });
    pics.push(this.stage.image);
    pics.push(this.stage.scripts.scriptsPicture());
    this.stage.customBlocks.forEach(function (def) {
        pics.push(def.scriptsPicture());
    });

    // collect global block pics
    this.stage.globalBlocks.forEach(function (def) {
        pics.push(def.scriptsPicture());
    });

    pics = pics.filter(function (each) {return !isNil(each); });

    // determine dimensions of composite
    pics.forEach(function (each) {
        w = Math.max(w, each.width);
        h += (each.height);
        h += padding;
    });
    h -= padding;
    pic = newCanvas(new Point(w, h));
    ctx = pic.getContext('2d');

    // draw all parts
    pics.forEach(function (each) {
        ctx.drawImage(each, 0, y);
        y += padding;
        y += each.height;
    });
    this.saveCanvasAs(pic, this.projectName || localize('Untitled'));
};

IDE_Morph.prototype.exportProjectSummary = function (useDropShadows) {
    var html, head, meta, css, body, pname, notes, toc, globalVars,
        stage = this.stage;

    function addNode(tag, node, contents) {
        if (!node) {node = body; }
        return new XML_Element(tag, contents, node);
    }

    function add(contents, tag, node) {
        if (!tag) {tag = 'p'; }
        if (!node) {node = body; }
        return new XML_Element(tag, contents, node);
    }

    function addImage(canvas, node, inline) {
        if (!node) {node = body; }
        var para = !inline ? addNode('p', node) : null,
            pic = addNode('img', para || node);
        pic.attributes.src = canvas.toDataURL();
        return pic;
    }

    function addVariables(varFrame) {
        var names = varFrame.names().sort(),
            isFirst = true,
            ul;
        if (names.length) {
            add(localize('Variables'), 'h3');
            names.forEach(function (name) {
                /*
                addImage(
                    SpriteMorph.prototype.variableBlock(name).scriptPic()
                );
                */
                var watcher, listMorph, li, img;

                if (isFirst) {
                    ul = addNode('ul');
                    isFirst = false;
                }
                li = addNode('li', ul);
                watcher = new WatcherMorph(
                    name,
                    SpriteMorph.prototype.blockColor.variables,
                    varFrame,
                    name
                );
                listMorph = watcher.cellMorph.contentsMorph;
                if (listMorph instanceof ListWatcherMorph) {
                    listMorph.expand();
                }
                img = addImage(watcher.fullImageClassic(), li);
                img.attributes.class = 'script';
            });
        }
    }

    function addBlocks(definitions) {
        if (definitions.length) {
            add(localize('Blocks'), 'h3');
            SpriteMorph.prototype.categories.forEach(function (category) {
                var isFirst = true,
                    ul;
                definitions.forEach(function (def) {
                    var li, blockImg;
                    if (def.category === category) {
                        if (isFirst) {
                            add(
                                localize(
                                    category[0].toUpperCase().concat(
                                        category.slice(1)
                                    )
                                ),
                                'h4'
                            );
                            ul = addNode('ul');
                            isFirst = false;
                        }
                        li = addNode('li', ul);
                        blockImg = addImage(
                            def.templateInstance().scriptPic(),
                            li
                        );
                        blockImg.attributes.class = 'script';
                        def.sortedElements().forEach(function (script) {
                            var defImg = addImage(
                                script instanceof BlockMorph ?
                                    script.scriptPic()
                                    : script.fullImageClassic(),
                                li
                            );
                            defImg.attributes.class = 'script';
                        });
                    }
                });
            });
        }
    }

    pname = this.projectName || localize('untitled');

    html = new XML_Element('html');
    html.attributes.lang = SnapTranslator.language;
    // html.attributes.contenteditable = 'true';

    head = addNode('head', html);

    meta = addNode('meta', head);
    meta.attributes.charset = 'UTF-8';

    if (useDropShadows) {
        css = 'img {' +
            'vertical-align: top;' +
            'filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));' +
            '-webkit-filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));' +
            '-ms-filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));' +
            '}' +
            '.toc {' +
            'vertical-align: middle;' +
            'padding: 2px 1em 2px 1em;' +
            '}';
    } else {
        css = 'img {' +
            'vertical-align: top;' +
            '}' +
            '.toc {' +
            'vertical-align: middle;' +
            'padding: 2px 1em 2px 1em;' +
            '}' +
            '.sprite {' +
            'border: 1px solid lightgray;' +
            '}';
    }
    addNode('style', head, css);

    add(pname, 'title', head);

    body = addNode('body', html);
    add(pname, 'h1');

    /*
    if (SnapCloud.username) {
        add(localize('by ') + SnapCloud.username);
    }
    */
    if (location.hash.indexOf('#present:') === 0) {
        add(location.toString(), 'a', body).attributes.href =
            location.toString();
        addImage(
            stage.thumbnail(stage.dimensions)
        ).attributes.class = 'sprite';
        add(this.serializer.app, 'h4');
    } else {
        add(this.serializer.app, 'h4');
        addImage(
            stage.thumbnail(stage.dimensions)
        ).attributes.class = 'sprite';
    }

    // project notes
    notes = Process.prototype.reportTextSplit(this.projectNotes, 'line');
    notes.asArray().forEach(
        function (paragraph) {add(paragraph); }
    );

    // table of contents
    add(localize('Contents'), 'h4');
    toc = addNode('ul');

    // sprites & stage
    this.sprites.asArray().concat([stage]).forEach(function (sprite) {
        var tocEntry = addNode('li', toc),
            scripts = sprite.scripts.sortedElements(),
            cl = sprite.costumes.length(),
            pic,
            ol;

        addNode('hr');
        addImage(
            sprite.thumbnail(new Point(40, 40)),
            tocEntry,
            true
        ).attributes.class = 'toc';
        add(sprite.name, 'a', tocEntry).attributes.href = '#' + sprite.name;

        add(sprite.name, 'h2').attributes.id = sprite.name;
        // if (sprite instanceof SpriteMorph || sprite.costume) {
        pic = addImage(
            sprite.thumbnail(sprite.extent().divideBy(stage.scale))
        );
        pic.attributes.class = 'sprite';
        if (sprite instanceof SpriteMorph) {
            if (sprite.exemplar) {
                addImage(
                    sprite.exemplar.thumbnail(new Point(40, 40)),
                    add(localize('Kind of') + ' ' + sprite.exemplar.name),
                    true
                ).attributes.class = 'toc';
            }
            if (sprite.anchor) {
                addImage(
                    sprite.anchor.thumbnail(new Point(40, 40)),
                    add(localize('Part of') + ' ' + sprite.anchor.name),
                    true
                ).attributes.class = 'toc';
            }
            if (sprite.parts.length) {
                add(localize('Parts'), 'h3');
                ol = addNode('ul');
                sprite.parts.forEach(function (part) {
                    var li = addNode('li', ol, part.name);
                    addImage(part.thumbnail(new Point(40, 40)), li, true)
                        .attributes.class = 'toc';
                });
            }
        }

        // costumes
        if (cl > 1 || (sprite.getCostumeIdx() !== cl)) {
            add(localize('Costumes'), 'h3');
            ol = addNode('ol');
            sprite.costumes.asArray().forEach(function (costume) {
                var li = addNode('li', ol, costume.name);
                addImage(costume.thumbnail(new Point(40, 40)), li, true)
                    .attributes.class = 'toc';
            });
        }

        // sounds
        if (sprite.sounds.length()) {
            add(localize('Sounds'), 'h3');
            ol = addNode('ol');
            sprite.sounds.asArray().forEach(function (sound) {
                add(sound.name, 'li', ol);
            });
        }

        // variables
        addVariables(sprite.variables);

        // scripts
        if (scripts.length) {
            add(localize('Scripts'), 'h3');
            scripts.forEach(function (script) {
                var img = addImage(script instanceof BlockMorph ?
                    script.scriptPic()
                    : script.fullImageClassic());
                img.attributes.class = 'script';
            });
        }

        // custom blocks
        addBlocks(sprite.customBlocks);
    });

    // globals
    globalVars = stage.globalVariables();
    if (Object.keys(globalVars.vars).length || stage.globalBlocks.length) {
        addNode('hr');
        add(
            localize('For all Sprites'),
            'a',
            addNode('li', toc)
        ).attributes.href = '#global';
        add(localize('For all Sprites'), 'h2').attributes.id = 'global';

        // variables
        addVariables(globalVars);

        // custom blocks
        addBlocks(stage.globalBlocks);
    }

    this.saveFileAs(
        '<!DOCTYPE html>' + html.toString(),
        'text/html;charset=utf-8',
        pname,
        true // request opening a new window.
    );
};

IDE_Morph.prototype.openProjectString = function (str) {
    var msg,
        myself = this;

    this.exitReplayMode();
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening project...');
        },
        function () {nop(); }, // yield (bug in Chrome)
        function () {
            SnapActions.openProject(str)
                .then(function() {
                    msg.destroy();
                });
        }
    ]);
};

IDE_Morph.prototype.rawOpenProjectString = function (str) {
    var project;

    this.toggleAppMode(false);
    this.spriteBar.tabBar.tabTo('scripts');
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    StageMorph.prototype.enableInheritance = false;
    StageMorph.prototype.enableSublistIDs = false;
    Process.prototype.enableLiveCoding = false;
    if (Process.prototype.isCatchingErrors) {
        try {
            project = this.serializer.openProject(
                this.serializer.load(str, this),
                this
            );
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        project = this.serializer.openProject(
            this.serializer.load(str, this),
            this
        );
    }
    this.stopFastTracking();
    return project;
};

IDE_Morph.prototype.openCloudDataString = function (str) {
    var msg,
        myself = this,
        size = Math.round(str.length / 1024);

    this.exitReplayMode();
    msg = myself.showMessage('Opening project\n' + size + ' KB...');
    return SnapActions.openProject(str)
        .then(function() {
            msg.destroy();
        });
};

IDE_Morph.prototype.rawOpenCloudDataString = function (str) {
    var model,
        project;
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    StageMorph.prototype.enableInheritance = false;
    StageMorph.prototype.enableSublistIDs = false;
    Process.prototype.enableLiveCoding = false;
    SnapActions.disableCollaboration();
    SnapUndo.reset();
    if (Process.prototype.isCatchingErrors) {
        try {
            model = this.serializer.parse(str);
            this.serializer.loadMediaModel(model.childNamed('media'));
            project = this.serializer.openProject(
                this.serializer.loadProjectModel(
                    model.childNamed('project'),
                    this
                ),
                this
            );
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        model = this.serializer.parse(str);
        this.serializer.loadMediaModel(model.childNamed('media'));
        project = this.serializer.openProject(
            this.serializer.loadProjectModel(
                model.childNamed('project'),
                this
            ),
            this
        );
    }
    this.stopFastTracking();
    return project;
};

IDE_Morph.prototype.uniqueIdForImport = function (str, name, callback) {
    var msg,
        myself = this;

    this.nextSteps([
        function () { nop(); }, // yield (bug in Chrome)
        function () {
            var model = myself.serializer.parse(str),
                children = model.allChildren();

            // Just add an id to everything... not the most efficient but effective for now
            for (var i = children.length; i--;) {
                if (children[i].attributes) {
                    children[i].attributes.collabId = SnapActions.newId();
                }
            }

            callback(model.toString());

        }
    ]);
};

IDE_Morph.prototype.openBlocksString = function (str, name, silently) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening blocks...');
        },
        function () {nop(); }, // yield (bug in Chrome)
        function () {
            myself.rawOpenBlocksString(str, name, silently);
        },
        function () {
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenBlocksString = function (str, name, silently) {
    // name is optional (string), so is silently (bool)
    var blocks,
        myself = this;
    if (Process.prototype.isCatchingErrors) {
        try {
            blocks = this.serializer.loadBlocks(str, myself.stage);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        blocks = this.serializer.loadBlocks(str, myself.stage);
    }
    if (silently) {
        this.importCustomBlocks(blocks, name);
    } else {
        new BlockImportDialogMorph(blocks, this.stage, name).popUp();
    }
    return blocks;
};

IDE_Morph.prototype.importCustomBlocks = function (blocks, name) {
    var myself = this;

    blocks.forEach(function (def) {
        def.receiver = myself.stage;
        myself.stage.globalBlocks.push(def);
        myself.stage.replaceDoubleDefinitionsFor(def);
    });
    this.flushPaletteCache();
    this.refreshPalette();
    this.showMessage(
        'Imported Blocks Module' + (name ? ': ' + name : '') + '.',
        2
    );
    SnapActions.loadCustomBlocks(blocks);
};

IDE_Morph.prototype.openSpritesString = function (str) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening sprite...');
        },
        function () {nop(); }, // yield (bug in Chrome)
        function () {
            myself.rawOpenSpritesString(str);
        },
        function () {
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenSpritesString = function (str) {
    if (Process.prototype.isCatchingErrors) {
        try {
            this.serializer.loadSprites(str, this);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.serializer.loadSprites(str, this);
    }
};

IDE_Morph.prototype.openMediaString = function (str) {
    if (Process.prototype.isCatchingErrors) {
        try {
            this.serializer.loadMedia(str);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.serializer.loadMedia(str);
    }
    this.showMessage('Imported Media Module.', 2);
};

IDE_Morph.prototype.openProject = function (name) {
    var str;
    if (name) {
        this.showMessage('opening project\n' + name);
        this.setProjectName(name);
        str = localStorage['-snap-project-' + name];
        SnapActions.disableCollaboration();
        SnapUndo.reset();
        this.openProjectString(str);
        this.setURL('#open:' + str);
    }
};

IDE_Morph.prototype.setURL = function (str) {
    // Set the URL to a project's XML contents
    if (this.projectsInURLs) {
        location.hash = str;
    }
};

IDE_Morph.prototype.saveFileAs = function (
    contents,
    fileType,
    fileName,
    newWindow // (optional) defaults to false.
) {
    /** Allow for downloading a file to a disk or open in a new tab.
     This relies the FileSaver.js library which exports saveAs()
     Two utility methods saveImageAs and saveXMLAs should be used first.
     1. Opening a new window uses standard URI encoding.
     2. downloading a file uses Blobs.
     - every other combo is unsupposed.
     */
    var blobIsSupported = false,
        world = this.world(),
        fileExt,
        dataURI, dialog;

    // fileType is a <kind>/<ext>;<charset> format.
    fileExt = fileType.split('/')[1].split(';')[0];
    // handle text/plain as a .txt file
    fileExt = '.' + (fileExt === 'plain' ? 'txt' : fileExt);

    // This is a workaround for a known Chrome crash with large URLs
    function exhibitsChomeBug(contents) {
        var MAX_LENGTH = 2e6,
            isChrome  = navigator.userAgent.indexOf('Chrome') !== -1;
        return isChrome && contents.length > MAX_LENGTH;
    }

    function dataURItoBlob(text, mimeType) {
        var i,
            data = text,
            components = text.split(','),
            hasTypeStr = text.indexOf('data:') === 0;
        // Convert to binary data, in format Blob() can use.
        if (hasTypeStr && components[0].indexOf('base64') > -1) {
            text = atob(components[1]);
            data = new Uint8Array(text.length);
            i = text.length;
            while (i--) {
                data[i] = text.charCodeAt(i);
            }
        }
        return new Blob([data], {type: mimeType });
    }

    function dataURLFormat(text) {
        var hasTypeStr = text.indexOf('data:') === 0;
        if (hasTypeStr) {return text; }
        return 'data:' + fileType + ',' + encodeURIComponent(text);
    }

    try {
        blobIsSupported = !!new Blob();
    } catch (e) {}

    if (newWindow) {
        // Blob URIs need a custom URL to be displayed in a new window
        if (contents instanceof Blob) {
            dataURI = URL.createObjectURL(contents);
        } else {
            dataURI = dataURLFormat(contents);
        }

        // Detect crashing errors - fallback to downloading if necessary
        if (!exhibitsChomeBug(dataURI)) {
            window.open(dataURI, fileName);
            // Blob URIs should be "cleaned up" to reduce memory.
            if (contents instanceof Blob) {
                URL.revokeObjectURL(dataURI);
            }
        } else {
            // (recursively) call this defauling newWindow to false
            this.showMessage('download to disk text');
            this.saveFileAs(contents, fileType, fileName);
        }
    } else if (blobIsSupported) {
        if (!(contents instanceof Blob)) {
            contents = dataURItoBlob(contents, fileType);
        }
        // download a file and delegate to FileSaver
        // false: Do not preprend a BOM to the file.
        saveAs(contents, fileName + fileExt, false);
    } else {
        dialog = new DialogBoxMorph();
        dialog.inform(
            localize('Could not export') + ' ' + fileName,
            'unable to export text',
            world
        );
        dialog.fixLayout();
        dialog.drawNew();
    }
};

IDE_Morph.prototype.saveCanvasAs = function (canvas, fileName) {
    // Export a Canvas object as a PNG image
    // Note: This commented out due to poor browser support.
    // cavas.toBlob() is currently supported in Firefox, IE, Chrome but
    // browsers prevent easily saving the generated files.
    // Do not re-enable without revisiting issue #1191
    // if (canvas.toBlob) {
    //     var myself = this;
    //     canvas.toBlob(function (blob) {
    //         myself.saveFileAs(blob, 'image/png', fileName, newWindow);
    //     });
    //     return;
    // }

    this.saveFileAs(canvas.toDataURL(), 'image/png', fileName);
};

IDE_Morph.prototype.saveXMLAs = function(xml, fileName, newWindow) {
    // wrapper to saving XML files with a proper type tag.
    this.saveFileAs(xml, 'text/xml;chartset=utf-8', fileName, newWindow);
};

IDE_Morph.prototype.switchToUserMode = function () {
    var world = this.world();

    world.isDevMode = false;
    Process.prototype.isCatchingErrors = true;
    this.controlBar.updateLabel();
    this.isAutoFill = true;
    this.isDraggable = false;
    this.reactToWorldResize(world.bounds.copy());
    this.siblings().forEach(function (morph) {
        if (morph instanceof DialogBoxMorph) {
            world.add(morph); // bring to front
        } else {
            morph.destroy();
        }
    });
    this.flushBlocksCache();
    this.refreshPalette();
    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = function (morph) {
        if (!(morph instanceof DialogBoxMorph)) {
            if (world.hand.grabOrigin) {
                morph.slideBackTo(world.hand.grabOrigin);
            } else {
                world.hand.grab(morph);
            }
        }
    };
    this.showMessage('entering user mode', 1);

};

IDE_Morph.prototype.switchToDevMode = function () {
    var world = this.world();

    world.isDevMode = true;
    Process.prototype.isCatchingErrors = false;
    this.controlBar.updateLabel();
    this.isAutoFill = false;
    this.isDraggable = true;
    this.setExtent(world.extent().subtract(100));
    this.setPosition(world.position().add(20));
    this.flushBlocksCache();
    this.refreshPalette();
    // enable non-DialogBoxMorphs to be dropped
    // onto the World in dev-mode
    delete world.reactToDropOf;
    this.showMessage(
        'entering development mode.\n\n'
        + 'error catching is turned off,\n'
        + 'use the browser\'s web console\n'
        + 'to see error messages.'
    );
};

IDE_Morph.prototype.flushBlocksCache = function (category) {
    // if no category is specified, the whole cache gets flushed
    if (category) {
        this.stage.blocksCache[category] = null;
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.blocksCache[category] = null;
            }
        });
    } else {
        this.stage.blocksCache = {};
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.blocksCache = {};
            }
        });
    }
    this.flushPaletteCache(category);
};

IDE_Morph.prototype.flushPaletteCache = function (category) {
    // if no category is specified, the whole cache gets flushed
    if (category) {
        this.stage.paletteCache[category] = null;
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.paletteCache[category] = null;
            }
        });
    } else {
        this.stage.paletteCache = {};
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.paletteCache = {};
            }
        });
    }
};

IDE_Morph.prototype.toggleZebraColoring = function () {
    var scripts = [];

    if (!BlockMorph.prototype.zebraContrast) {
        BlockMorph.prototype.zebraContrast = 40;
    } else {
        BlockMorph.prototype.zebraContrast = 0;
    }

    // select all scripts:
    this.stage.children.concat(this.stage).forEach(function (morph) {
        if (isSnapObject(morph)) {
            scripts = scripts.concat(
                morph.scripts.children.filter(function (morph) {
                    return morph instanceof BlockMorph;
                })
            );
        }
    });

    // force-update all scripts:
    scripts.forEach(function (topBlock) {
        topBlock.fixBlockColor(null, true);
    });
};

IDE_Morph.prototype.toggleDynamicInputLabels = function () {
    var projectData;
    SyntaxElementMorph.prototype.dynamicInputLabels =
        !SyntaxElementMorph.prototype.dynamicInputLabels;
    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(this.stage);
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(this.stage);
    }
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.createCorralBar();
    SnapUndo.reset();
    this.openProjectString(projectData);
};

IDE_Morph.prototype.toggleBlurredShadows = function () {
    window.useBlurredShadows = !useBlurredShadows;
};

IDE_Morph.prototype.toggleLongFormInputDialog = function () {
    InputSlotDialogMorph.prototype.isLaunchingExpanded =
        !InputSlotDialogMorph.prototype.isLaunchingExpanded;
    if (InputSlotDialogMorph.prototype.isLaunchingExpanded) {
        this.saveSetting('longform', true);
    } else {
        this.removeSetting('longform');
    }
};

IDE_Morph.prototype.togglePlainPrototypeLabels = function () {
    BlockLabelPlaceHolderMorph.prototype.plainLabel =
        !BlockLabelPlaceHolderMorph.prototype.plainLabel;
    if (BlockLabelPlaceHolderMorph.prototype.plainLabel) {
        this.saveSetting('plainprototype', true);
    } else {
        this.removeSetting('plainprototype');
    }
};

IDE_Morph.prototype.togglePreferEmptySlotDrops = function () {
    ScriptsMorph.prototype.isPreferringEmptySlots =
        !ScriptsMorph.prototype.isPreferringEmptySlots;
};

IDE_Morph.prototype.toggleVirtualKeyboard = function () {
    MorphicPreferences.useVirtualKeyboard =
        !MorphicPreferences.useVirtualKeyboard;
};

IDE_Morph.prototype.toggleInputSliders = function () {
    MorphicPreferences.useSliderForInput =
        !MorphicPreferences.useSliderForInput;
};

IDE_Morph.prototype.toggleSliderExecute = function () {
    ArgMorph.prototype.executeOnSliderEdit =
        !ArgMorph.prototype.executeOnSliderEdit;
};

IDE_Morph.prototype.toggleAppMode = function (appMode) {
    var world = this.world(),
        elements = [
            this.logo,
            this.controlBar.cloudButton,
            this.controlBar.projectButton,
            this.controlBar.settingsButton,
            this.controlBar.steppingButton,
            this.controlBar.stageSizeButton,
            this.paletteHandle,
            this.stageHandle,
            this.corral,
            //this.corralBar,
            this.spriteEditor,
            this.spriteBar,
            this.palette,
            this.categories,
            this.stage
        ];

    this.isAppMode = isNil(appMode) ? !this.isAppMode : appMode;

    Morph.prototype.trackChanges = false;
    if (this.isAppMode) {
        this.wasSingleStepping = Process.prototype.enableSingleStepping;
        if (this.wasSingleStepping) {
            this.toggleSingleStepping();
        }
        this.setColor(this.appModeColor);
        this.controlBar.setColor(this.color);
        this.controlBar.appModeButton.refresh();
        elements.forEach(function (e) {
            e.hide();
        });
        world.children.forEach(function (morph) {
            if (morph instanceof DialogBoxMorph) {
                morph.hide();
            }
        });
        if (world.keyboardReceiver instanceof ScriptFocusMorph) {
            world.keyboardReceiver.stopEditing();
        }
    } else {

        console.log("appModeExit activity no: ", activity_name)

        if (activity_name === "activity2") {
            window.parent.postMessage('appModeExit','*');
            console.log("It is", activity_name, "---sending the post message")
        
        } else{
            console.log("It is", activity_name, " ---not sending the post message")

        }
        

        if (this.wasSingleStepping && !Process.prototype.enableSingleStepping) {
            this.toggleSingleStepping();
        }
        this.setColor(this.backgroundColor);
        this.controlBar.setColor(this.frameColor);
        elements.forEach(function (e) {
            e.show();
        });
        this.stage.setScale(1);
        // show all hidden dialogs
        world.children.forEach(function (morph) {
            if (morph instanceof DialogBoxMorph) {
                morph.show();
            }
        });
        // prevent scrollbars from showing when morph appears
        world.allChildren().filter(function (c) {
            return c instanceof ScrollFrameMorph;
        }).forEach(function (s) {
            s.adjustScrollBars();
        });
        // prevent rotation and draggability controls from
        // showing for the stage
        if (this.currentSprite === this.stage) {
            this.spriteBar.children.forEach(function (child) {
                if (child instanceof PushButtonMorph) {
                    child.hide();
                }
            });
        }
    }
    this.setExtent(this.world().extent()); // resume trackChanges
    // check for mobilemode
    if (this.isMobileDevice() && this.isAppMode) {
        this.mobileMode.init();
    }

};

IDE_Morph.prototype.toggleStageSize = function (isSmall, forcedRatio) {
    var myself = this,
        smallRatio = forcedRatio || 0.5,
        msecs = this.isAnimating ? 100 : 0,
        world = this.world(),
        shiftClicked = (world.currentKey === 16),
        altClicked = (world.currentKey === 18);

    function toggle() {
        myself.isSmallStage = isNil(isSmall) ? !myself.isSmallStage : isSmall;
    }

    function zoomTo(targetRatio) {
        myself.isSmallStage = true;
        world.animations.push(new Animation(
            function (ratio) {
                myself.stageRatio = ratio;
                myself.setExtent(world.extent());
            },
            function () {
                return myself.stageRatio;
            },
            targetRatio - myself.stageRatio,
            msecs,
            null, // easing
            function () {
                myself.isSmallStage = (targetRatio !== 1);
                myself.controlBar.stageSizeButton.refresh();
            }
        ));
    }

    if (shiftClicked) {
        smallRatio = SpriteIconMorph.prototype.thumbSize.x * 3 /
            this.stage.dimensions.x;
        if (!this.isSmallStage || (smallRatio === this.stageRatio)) {
            toggle();
        }
    } else if (altClicked) {
        smallRatio = this.width() / 2 /
            this.stage.dimensions.x;
        if (!this.isSmallStage || (smallRatio === this.stageRatio)) {
            toggle();
        }
    } else {
        toggle();
    }
    if (this.isSmallStage) {
        zoomTo(smallRatio);
    } else {
        zoomTo(1);
    }
};

IDE_Morph.prototype.toggleAgentImage = function (convoNum) {
    console.log("In AAAAAA: interventionNumber is:" + interventionNumber);
    if (intervention == false){
        if (this.conversationPause){
            this.isOriginalAgent = !this.isOriginalAgent;
            var moreConvo= false;
            var audio = '/WoZ_audios/';
            var image;
            var audioLength;
    
            var convoAndTime;
    
            if (convoNum === null || activity_name == null) {
                image = 45; 
                this.agentPanel.destroy(); 
                this.speechBubblePanel.destroy();
            }
            else {
                if (window['futureConversation'+convoNum].length > 0) {
                    audio = audio + window['futureAudio'+convoNum][0];
                    audioLength = window['audioTimes'+convoNum][0];
                    moreConvo = true;
                }
                image = window['futureImages'+convoNum][0];
            }
            return [moreConvo,audioLength];
        }
        else {
            console.log("In IDE_Morph.prototype.toggleAgentImage");
            console.log("conversation pause status is : "+this.conversationPause);
            //This is where we move the conversation forward (audio, text, images) and
            //where we keep track of conversation history
    
            this.isOriginalAgent = !this.isOriginalAgent;
            var moreConvo= false;
            var audio = '/WoZ_audios/';
            var image;
            var audioLength;
    
            //The return object that contains whether the conversations are complete
            // and how much time the next clip is
            var convoAndTime;
    
            if (convoNum === null || activity_name.includes('activity1')) {
                image = 45; 
                this.agentPanel.destroy(); 
                this.speechBubblePanel.destroy();
            }
            else {
                if (window['futureConversation'+convoNum].length > 0) {
                    //get the upcoming utterance from futureConversation and store it in currentUtterance
                    var currentUtterance = window['futureConversation'+convoNum][0];
                    window['futureConversation'+convoNum].shift();
                    if (currentUtterance != "") {
                        conversationHistory.push(currentUtterance);
                        console.log(conversationHistory.length);
                        if (conversationHistory.length > 2) {
                            conversationHistory.shift();
                        }
                    }
                    audio = audio + window['futureAudio'+convoNum][0];
                    window['futureAudio'+convoNum].shift();
                    audioLength = window['audioTimes'+convoNum][0];
                    window['audioTimes'+convoNum].shift()
                    moreConvo = true;
                }
                if (window['futureImages'+convoNum].length == 0) {
                    image = 45;
                    this.initiateIntervention();
                } else {
                    image = window['futureImages'+convoNum][0];
                }
                window['futureImages'+convoNum].shift();
    
                if (window['futureSpeaker'+convoNum].length > 0) {
                    var currentSpeaker = window['futureSpeaker'+convoNum][0];
                    window['futureSpeaker'+convoNum].shift();
                    speakerHistory.push(currentSpeaker);
                    if (speakerHistory.length > 2) {
                        speakerHistory.shift();
                    }
                    BlockMorph.prototype.snapSound = document.createElement('audio');
                    BlockMorph.prototype.snapSound.src = audio;//'/audio/' + futureAudio[0];
                    BlockMorph.prototype.snapSound.play();
                }
            }
            this.createSpeechBubblePanel();
            this.createAgentPanel(parseInt(image));
    
            var windowWidth = window.screen.height * window.devicePixelRatio;
    
            console.log("Window Resolution: " + windowWidth);
    
            //if (windowWidth < 1000) {

            // FLECKS - Added this line to avoid saving setStageSize to the project-actions logs repeatedly.
            SnapActions.setStageSize(480, 380);
    
            this.fixLayout();
    
            return [moreConvo,audioLength];
        }
    }
    else{
        // this.initiateIntervention(interventionNumber);
        console.log("play intervention music!")
        console.log("window['futureAudio'+convoNum].shift();" + window['futureAudio'+convoNum]);
        var audio = '/WoZ_audios/';
            var image;
            var audioLength;
    
            //The return object that contains whether the conversations are complete
            // and how much time the next clip is
            var convoAndTime;
    
            if (convoNum === null || activity_name.includes('activity1')) {
                image = 11; 
                this.agentPanel.destroy(); 
                this.speechBubblePanel.destroy();
            }
            else {
                if (window['futureConversation'+convoNum].length > 0) {
                    //get the upcoming utterance from futureConversation and store it in currentUtterance
                    var currentUtterance = window['futureConversation'+convoNum][0];
                    window['futureConversation'+convoNum].shift();
                    if (currentUtterance != "") {
                        conversationHistory.push(currentUtterance);
                        console.log(conversationHistory.length);
                        if (conversationHistory.length > 2) {
                            conversationHistory.shift();
                        }
                    }
                    audio = audio + window['futureAudio'+convoNum][0];
                    window['futureAudio'+convoNum].shift();
                    audioLength = window['audioTimes'+convoNum][0];
                    window['audioTimes'+convoNum].shift()
                    moreConvo = true;
                }
                if (window['futureImages'+convoNum].length == 0) {
                    image = 11;
                    this.initiateIntervention();
                } else {
                    image = window['futureImages'+convoNum][0];
                }
                window['futureImages'+convoNum].shift();
    
                if (window['futureSpeaker'+convoNum].length > 0) {
                    var currentSpeaker = window['futureSpeaker'+convoNum][0];
                    window['futureSpeaker'+convoNum].shift();
                    speakerHistory.push(currentSpeaker);
                    if (speakerHistory.length > 2) {
                        speakerHistory.shift();
                    }
                    BlockMorph.prototype.snapSound = document.createElement('audio');
                    BlockMorph.prototype.snapSound.src = audio;//'/audio/' + futureAudio[0];
                    BlockMorph.prototype.snapSound.play();
                }
            }
            this.createSpeechBubblePanel();
            this.createAgentPanel(parseInt(image)-1);
    
            var windowWidth = window.screen.height * window.devicePixelRatio;
    
            console.log("Window Resolution: " + windowWidth);
    
            //if (windowWidth < 1000) {
            SnapActions.setStageSize(480, 380);
    
            this.fixLayout();
    
            return [moreConvo,audioLength];
    }
};

IDE_Morph.prototype.setPaletteWidth = function (newWidth) {
    var msecs = this.isAnimating ? 100 : 0,
        world = this.world(),
        myself = this;

    world.animations.push(new Animation(
        function (newWidth) {
            myself.paletteWidth = newWidth;
            myself.setExtent(world.extent());
        },
        function () {
            return myself.paletteWidth;
        },
        newWidth - myself.paletteWidth,
        msecs
    ));
};

IDE_Morph.prototype.createNewProject = function () {
    var myself = this;
    this.confirm(
        'Replace the current project with a new one?',
        'New Project',
        function () {
            myself.exitReplayMode();
            SnapActions.disableCollaboration();
            SnapUndo.reset();
            myself.newProject();
        }
    );
};

IDE_Morph.prototype.switchRoles = function () {
    var myself = this;
    this.switchRolesAsk(
        // 'It is time to switch roles! \n When you are ready, switch your seats',
        'When you are ready, switch your seats',
        'Switch Roles',
        function () {
            console.log("Confirmed switching roles")
            myself.exitReplayMode();
            myself.confirmSwitchRoles()
        }
    );
};
IDE_Morph.prototype.confirmSwitchRoles = function () {
    var myself = this;
    this.finalConfirmswitchRolesAsk(
        'Are you ready?',
        'Are you ready?',
        function () {
            myself.exitReplayMode();
            console.log("Confirmed switching roles")
            SnapActions.switchRoles();
            SnapActions.restartAgent();
        }
    );
};
IDE_Morph.prototype.joinIntervention = function () {
    var myself = this;
    this.joinInterventionAsk(
        'Hey! Can we join the conversation?',
        'Asking for Permission Roles',
        function () {
            myself.exitReplayMode();
            SnapActions.restartAgent()
        }
    );
};


IDE_Morph.prototype.openProjectsBrowser = function () {
    new ProjectDialogMorph(this, 'open').popUp();
};

IDE_Morph.prototype.saveProjectsBrowser = function () {
    if (this.source === 'examples') {
        this.source = 'local'; // cannot save to examples
    }
    new ProjectDialogMorph(this, 'save').popUp();
};

// IDE_Morph localization

IDE_Morph.prototype.languageMenu = function () {
    var menu = new MenuMorph(this),
        world = this.world(),
        pos = this.controlBar.settingsButton.bottomLeft(),
        myself = this;
    SnapTranslator.languages().forEach(function (lang) {
        menu.addItem(
            (SnapTranslator.language === lang ? '\u2713 ' : '    ') +
            SnapTranslator.languageName(lang),
            function () {
                myself.loadNewProject = false;
                myself.setLanguage(lang);
            }
        );
    });
    menu.popup(world, pos);
};

IDE_Morph.prototype.setLanguage = function (lang, callback) {
    var translation = document.getElementById('language'),
        src = this.resourceURL('lang-' + lang + '.js'),
        myself = this;
    SnapTranslator.unload();
    if (translation) {
        document.head.removeChild(translation);
    }
    if (lang === 'en') {
        return this.reflectLanguage('en', callback);
    }
    translation = document.createElement('script');
    translation.id = 'language';
    translation.onload = function () {
        myself.reflectLanguage(lang, callback);
    };
    document.head.appendChild(translation);
    translation.src = src;
};

IDE_Morph.prototype.reflectLanguage = function (lang, callback) {
    var projectData,
        urlBar = location.hash;
    SnapTranslator.language = lang;
    if (!this.loadNewProject) {
        if (Process.prototype.isCatchingErrors) {
            try {
                projectData = this.serializer.serialize(this.stage);
            } catch (err) {
                this.showMessage('Serialization failed: ' + err);
            }
        } else {
            projectData = this.serializer.serialize(this.stage);
        }
    }
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.createCorralBar();
    this.fixLayout();
    if (this.loadNewProject) {
        this.newProject();
        location.hash = urlBar;
    } else {
        SnapUndo.reset();
        this.openProjectString(projectData);
    }
    this.saveSetting('language', lang);
    if (callback) {callback.call(this); }
};

// IDE_Morph blocks scaling

IDE_Morph.prototype.userSetBlocksScale = function () {
    var myself = this,
        scrpt,
        blck,
        shield,
        sample,
        action;

    scrpt = new CommandBlockMorph();
    scrpt.color = SpriteMorph.prototype.blockColor.motion;
    scrpt.setSpec(localize('build'));
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.sound;
    blck.setSpec(localize('your own'));
    scrpt.nextBlock(blck);
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.operators;
    blck.setSpec(localize('blocks'));
    scrpt.bottomBlock().nextBlock(blck);
    /*
    blck = SpriteMorph.prototype.blockForSelector('doForever');
    blck.inputs()[0].nestedBlock(scrpt);
    */

    sample = new FrameMorph();
    sample.acceptsDrops = false;
    sample.color = IDE_Morph.prototype.groupColor;
    sample.cachedTexture = this.scriptsPaneTexture;
    sample.setExtent(new Point(250, 180));
    scrpt.setPosition(sample.position().add(10));
    sample.add(scrpt);

    shield = new Morph();
    shield.alpha = 0;
    shield.setExtent(sample.extent());
    shield.setPosition(sample.position());
    sample.add(shield);

    action = function (num) {
        /*
            var c;
            blck.setScale(num);
            blck.drawNew();
            blck.setSpec(blck.blockSpec);
            c = blck.inputs()[0];
            c.setScale(num);
            c.nestedBlock(scrpt);
        */
        scrpt.blockSequence().forEach(function (block) {
            block.setScale(num);
            block.drawNew();
            block.setSpec(block.blockSpec);
        });
        scrpt.changed();
    };

    new DialogBoxMorph(
        null,
        function (num) {
            myself.setBlocksScale(Math.min(num, 12));
        }
    ).withKey('zoomBlocks').prompt(
        'Zoom blocks',
        SyntaxElementMorph.prototype.scale.toString(),
        this.world(),
        sample, // pic
        {
            'normal (1x)' : 1,
            'demo (1.2x)' : 1.2,
            'presentation (1.4x)' : 1.4,
            'big (2x)' : 2,
            'huge (4x)' : 4,
            'giant (8x)' : 8,
            'monstrous (10x)' : 10
        },
        false, // read only?
        true, // numeric
        1, // slider min
        12, // slider max
        action // slider action
    );
};

IDE_Morph.prototype.setBlocksScale = function (num) {
    var projectData;
    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(this.stage);
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(this.stage);
    }
    SyntaxElementMorph.prototype.setScale(num);
    CommentMorph.prototype.refreshScale();
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.createCorralBar();
    this.fixLayout();
    this.openProjectString(projectData);
    this.saveSetting('zoom', num);
};

// IDE_Morph stage size manipulation

IDE_Morph.prototype.userSetStageSize = function () {
    new DialogBoxMorph(
        this,
        function(point) {
            SnapActions.setStageSize(point.x, point.y);
        },
        this
    ).promptVector(
        "Stage size",
        StageMorph.prototype.dimensions,
        new Point(480, 360),
        'Stage width',
        'Stage height',
        this.world(),
        null, // pic
        null // msg
    );
};

IDE_Morph.prototype.setStageExtent = function (aPoint) {
    var myself = this,
        world = this.world(),
        ext = aPoint.max(new Point(480, 180));

    function zoom() {
        myself.step = function () {
            var delta = ext.subtract(
                StageMorph.prototype.dimensions
            ).divideBy(2);
            if (delta.abs().lt(new Point(5, 5))) {
                StageMorph.prototype.dimensions = ext;
                delete myself.step;
            } else {
                StageMorph.prototype.dimensions =
                    StageMorph.prototype.dimensions.add(delta);
            }
            myself.stage.setExtent(StageMorph.prototype.dimensions);
            myself.stage.clearPenTrails();
            myself.fixLayout();
            this.setExtent(world.extent());
        };
    }

    this.stageRatio = 1;
    this.isSmallStage = false;
    this.controlBar.stageSizeButton.refresh();
    this.setExtent(world.extent());
    if (this.isAnimating) {
        zoom();
    } else {
        StageMorph.prototype.dimensions = ext;
        this.stage.setExtent(StageMorph.prototype.dimensions);
        this.stage.clearPenTrails();
        this.fixLayout();
        this.setExtent(world.extent());
    }
};

// IDE_Morph dragging threshold (internal feature)

IDE_Morph.prototype.userSetDragThreshold = function () {
    new DialogBoxMorph(
        this,
        function (num) {
            MorphicPreferences.grabThreshold = Math.min(
                Math.max(+num, 0),
                200
            );
        },
        this
    ).prompt(
        "Dragging threshold",
        MorphicPreferences.grabThreshold.toString(),
        this.world(),
        null, // pic
        null, // choices
        null, // read only
        true // numeric
    );
};

// IDE_Morph cloud interface

IDE_Morph.prototype.initializeCloud = function () {
    var myself = this,
        world = this.world();
    new DialogBoxMorph(
        null,
        function (user) {
            var pwh = hex_sha512(user.password),
                str;
            SnapCloud.login(
                user.username,
                pwh,
                function () {
                    if (user.choice) {
                        str = SnapCloud.encodeDict(
                            {
                                username: user.username,
                                password: pwh
                            }
                        );
                        localStorage['-snap-user'] = str;
                    }
                    myself.source = 'cloud';
                    myself.showMessage('now connected.', 2);
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudlogin').promptCredentials(
        'Sign in',
        'login',
        null,
        null,
        null,
        null,
        'stay signed in on this computer\nuntil logging out',
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.createCloudAccount = function () {
    var myself = this,
        world = this.world();
    /*
        // force-logout, commented out for now:
        delete localStorage['-snap-user'];
        SnapCloud.clear();
    */
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.signup(
                user.username,
                user.email,
                function (txt, title) {
                    new DialogBoxMorph().inform(
                        title,
                        txt +
                        '.\n\nAn e-mail with your password\n' +
                        'has been sent to the address provided',
                        world,
                        myself.cloudIcon(null, new Color(0, 180, 0))
                    );
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudsignup').promptCredentials(
        'Sign up',
        'signup',
        'http://snap.berkeley.edu/tos.html',
        'Terms of Service...',
        'http://snap.berkeley.edu/privacy.html',
        'Privacy...',
        'I have read and agree\nto the Terms of Service',
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.promptCollaboration = function () {
    var dialog = new DialogBoxMorph().withKey('promptCollab'),
        frame = new AlignmentMorph('column', 10),
        passcodeLabel = new TextMorph(localize('Share the following url with any collaborators:')),
        hash,
        ok = dialog.ok,
        myself = this,
        size = 250,
        passCode = SnapActions.sessionId,
        world = this.world();

    hash = 'collaborate=' + passCode;
    shareCode = window.location.origin + '#' + hash,
        location.hash = hash;

    frame.add(passcodeLabel);
    frame.add(new TextMorph(shareCode));

    dialog.labelString = 'Collaboration';
    dialog.createLabel();

    dialog.addBody(frame);
    frame.drawNew();
    dialog.addButton('ok', 'OK');
    dialog.addButton('cancel', 'Cancel');
    dialog.fixLayout();
    dialog.drawNew();
    dialog.popUp(world);
    dialog.setCenter(world.center());
};

IDE_Morph.prototype.promptExitReplay = function (onExit) {
    var myself = this;
    this.confirm(
        'The given action cannot be applied while in replay mode. \n' +
        'Would you like to exit replay mode?',
        'Exit Replay?',
        function() {
            myself.exitReplayMode();
            onExit();
        }
    );
};

IDE_Morph.prototype.resetCloudPassword = function () {
    var myself = this,
        world = this.world();
    /*
        // force-logout, commented out for now:
        delete localStorage['-snap-user'];
        SnapCloud.clear();
    */
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.resetPassword(
                user.username,
                function (txt, title) {
                    new DialogBoxMorph().inform(
                        title,
                        txt +
                        '.\n\nAn e-mail with a link to\n' +
                        'reset your password\n' +
                        'has been sent to the address provided',
                        world,
                        myself.cloudIcon(null, new Color(0, 180, 0))
                    );
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudresetpassword').promptCredentials(
        'Reset password',
        'resetPassword',
        null,
        null,
        null,
        null,
        null,
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.changeCloudPassword = function () {
    var myself = this,
        world = this.world();
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.changePassword(
                user.oldpassword,
                user.password,
                function () {
                    myself.logout();
                    myself.showMessage('password has been changed.', 2);
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudpassword').promptCredentials(
        'Change Password',
        'changePassword',
        null,
        null,
        null,
        null,
        null,
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.logout = function () {
    var myself = this;
    delete localStorage['-snap-user'];
    SnapCloud.logout(
        function () {
            SnapCloud.clear();
            myself.showMessage('disconnected.', 2);
        },
        function () {
            SnapCloud.clear();
            myself.showMessage('disconnected.', 2);
        }
    );
};

IDE_Morph.prototype.saveProjectToCloud = function (name) {
    var myself = this,
        contentName = this.room.hasMultipleRoles() ?
            this.room.getCurrentRoleName() : this.room.name;

    if (name) {
        this.showMessage('Saving ' + contentName + '\nto the cloud...');
        this.room.name = name;
        SnapCloud.saveProject(
            this,
            function (result) {
                if (result.name) {
                    myself.room.silentSetRoomName(result.name);
                }
                myself.showMessage('Saved ' + contentName + ' to the cloud!', 2);
            },
            this.cloudSaveError()
        );
    }
};

IDE_Morph.prototype.exportProjectMedia = function (name) {
    var menu, media;
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        try {
            menu = this.showMessage('Exporting');
            media = this.serializer.mediaXML(name);
            this.saveXMLAs(media, this.projectName + ' media');
            menu.destroy();
            this.showMessage('Exported!', 1);
        } catch (err) {
            if (Process.prototype.isCatchingErrors) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            } else {
                throw err;
            }
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    // this.hasChangedMedia = false;
};

IDE_Morph.prototype.exportProjectNoMedia = function (name) {
    var menu, str;
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                str = this.serializer.serialize(this.stage);
                this.saveXMLAs(str, this.projectName);
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            str = this.serializer.serialize(this.stage);
            this.saveXMLAs(str, this.projectName);
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
};

IDE_Morph.prototype.exportProjectAsCloudData = function (name) {
    var menu, str, media, replay, dta;
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                str = this.serializer.serialize(this.stage);
                media = this.serializer.mediaXML(name);
                replay = this.serializer.replayHistory();
                dta = '<snapdata>' + str + replay + media + '</snapdata>';
                this.saveXMLAs(str, this.projectName);
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            str = this.serializer.serialize(this.stage);
            media = this.serializer.mediaXML(name);
            replay = this.serializer.replayHistory();
            dta = '<snapdata>' + str + replay + media + '</snapdata>';
            this.saveXMLAs(str, this.projectName);
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    // this.hasChangedMedia = false;
};

IDE_Morph.prototype.cloudAcknowledge = function () {
    var myself = this;
    return function (responseText, url) {
        nop(responseText);
        new DialogBoxMorph().inform(
            'Cloud Connection',
            'Successfully connected to:\n'
            + 'http://'
            + url,
            myself.world(),
            myself.cloudIcon(null, new Color(0, 180, 0))
        );
    };
};

IDE_Morph.prototype.cloudResponse = function () {
    var myself = this;
    return function (responseText, url) {
        var response = responseText;
        if (response.length > 50) {
            response = response.substring(0, 50) + '...';
        }
        new DialogBoxMorph().inform(
            'Snap!Cloud',
            'http://'
            + url + ':\n\n'
            + 'responds:\n'
            + response,
            myself.world(),
            myself.cloudIcon(null, new Color(0, 180, 0))
        );
    };
};

IDE_Morph.prototype.cloudError = function () {
    var myself = this;

    // try finding an eplanation what's going on
    // has some issues, commented out for now
    /*
    function getURL(url) {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send();
            if (request.status === 200) {
                return request.responseText;
            }
            return null;
        } catch (err) {
            return null;
        }
    }
    */

    return function (responseText, url) {
        // first, try to find out an explanation for the error
        // and notify the user about it,
        // if none is found, show an error dialog box
        var response = responseText,
            // explanation = getURL('http://snap.berkeley.edu/cloudmsg.txt'),
            explanation = null;
        if (myself.shield) {
            myself.shield.destroy();
            myself.shield = null;
        }
        if (explanation) {
            myself.showMessage(explanation);
            return;
        }
        if (response.length > 50) {
            response = response.substring(0, 50) + '...';
        }
        new DialogBoxMorph().inform(
            'Snap!Cloud',
            (url ? url + '\n' : '')
            + response,
            myself.world(),
            myself.cloudIcon(null, new Color(180, 0, 0))
        );
    };
};

IDE_Morph.prototype.cloudIcon = function (height, color) {
    var clr = color || DialogBoxMorph.prototype.titleBarColor,
        isFlat = MorphicPreferences.isFlat,
        icon = new SymbolMorph(
            isFlat ? 'cloud' : 'cloudGradient',
            height || 50,
            clr,
            isFlat ? null : new Point(-1, -1),
            clr.darker(50)
        );
    if (!isFlat) {
        icon.addShadow(new Point(1, 1), 1, clr.lighter(95));
    }
    return icon;
};

IDE_Morph.prototype.setCloudURL = function () {
    new DialogBoxMorph(
        null,
        function (url) {
            SnapCloud.url = url;
        }
    ).withKey('cloudURL').prompt(
        'Cloud URL',
        SnapCloud.url,
        this.world(),
        null,
        {
            'Snap!Cloud' :
                'https://snap.apps.miosoft.com/SnapCloud'
        }
    );
};

// IDE_Morph HTTP data fetching

IDE_Morph.prototype.getURL = function (url, callback) {
    // fetch the contents of a url and pass it into the specified callback.
    // If no callback is specified synchronously fetch and return it
    // Note: Synchronous fetching has been deprecated and should be switched
    var request = new XMLHttpRequest(),
        async = callback instanceof Function,
        myself = this;
    try {
        request.open('GET', url, async);
        if (async) {
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.responseText) {
                        callback.call(
                            myself,
                            request.responseText
                        );
                    } else {
                        throw new Error('unable to retrieve ' + url);
                    }
                }
            };
        }
        request.send();
        if (!async) {
            if (request.status === 200) {
                return request.responseText;
            }
            throw new Error('unable to retrieve ' + url);
        }
    } catch (err) {
        myself.showMessage(err.toString());
        if (async) {
            callback.call(this);
        } else {
            return request.responseText;
        }
    }
};

// IDE_Morph user dialog shortcuts

IDE_Morph.prototype.showMessage = function (message, secs) {
    var m = new MenuMorph(null, message),
        intervalHandle;
    m.popUpCenteredInWorld(this.world());
    if (secs) {
        intervalHandle = setInterval(function () {
            m.destroy();
            clearInterval(intervalHandle);
        }, secs * 1000);
    }
    return m;
};

IDE_Morph.prototype.inform = function (title, message) {
    new DialogBoxMorph().inform(
        title,
        localize(message),
        this.world(),
        function () {
            // myself.exitReplayMode();
            // SnapActions.disableCollaboration();
            // SnapUndo.reset();
            console.log("----informed")
            myself.newProject();
        }
    );
};



IDE_Morph.prototype.confirm = function (message, title, action) {
    new DialogBoxMorph(null, action).askYesNo(
        title,
        localize(message),
        this.world(),
        );
};

IDE_Morph.prototype.switchRolesAsk = function (message, title, action) {
    var switch1 = agentPanelTextureArray[agentPanelTextureArray.length-3]; //asking image
    new DialogBoxMorph(null, action).askProceedSwitch(
        title,
        localize(message),
        this.world(),
        switch1
        );
};


IDE_Morph.prototype.finalConfirmswitchRolesAsk = function (message, title, action) {
    var switch1 = agentPanelTextureArray[agentPanelTextureArray.length-2]; //asking image
    new DialogBoxMorph(null, action).askProceedSwitch(
        title,
        localize(message),
        this.world(),
        switch1
        );
};
IDE_Morph.prototype.joinInterventionAsk = function (message, title, action) {
    var switch2 = agentPanelTextureArray[agentPanelTextureArray.length-1]; //asking image
    new DialogBoxMorph(null, action).askProceedSwitch(
        title,
        localize(message),
        this.world(),
        switch2
        );
};


IDE_Morph.prototype.prompt = function (message, callback, choices, key) {
    (new DialogBoxMorph(null, callback)).withKey(key).prompt(
        message,
        '',
        this.world(),
        null,
        choices
    );
};

// ProjectDialogMorph ////////////////////////////////////////////////////

// ProjectDialogMorph inherits from DialogBoxMorph:

ProjectDialogMorph.prototype = new DialogBoxMorph();
ProjectDialogMorph.prototype.constructor = ProjectDialogMorph;
ProjectDialogMorph.uber = DialogBoxMorph.prototype;

// ProjectDialogMorph instance creation:

function ProjectDialogMorph(ide, label) {
    this.init(ide, label);
}

ProjectDialogMorph.prototype.init = function (ide, task) {
    var myself = this;

    var timeout1;

    // additional properties:
    this.ide = ide;
    this.task = task || 'open'; // String describing what do do (open, save)
    this.source = ide.source || 'local'; // or 'cloud' or 'examples'
    this.projectList = []; // [{name: , thumb: , notes:}]

    this.handle = null;
    this.srcBar = null;
    this.nameField = null;
    this.filterField = null;
    this.magnifiyingGlass = null;
    this.listField = null;
    this.preview = null;
    this.notesText = null;
    this.notesField = null;
    this.deleteButton = null;
    this.shareButton = null;
    this.unshareButton = null;

    // initialize inherited properties:
    ProjectDialogMorph.uber.init.call(
        this,
        this, // target
        null, // function
        null // environment
    );

    // override inherited properites:
    this.labelString = this.task === 'save' ? 'Save Project' : 'Open Project';
    this.createLabel();
    this.key = 'project' + task;

    // build contents
    this.buildContents();
    this.onNextStep = function () { // yield to show "updating" message
        myself.setSource(myself.source);
    };
};

ProjectDialogMorph.prototype.buildContents = function () {
    var thumbnail, notification, baseSize = new Point(455, 335);

    this.addBody(new Morph());
    this.body.color = this.color;

    this.srcBar = new AlignmentMorph('column', this.padding / 2);

    if (this.ide.cloudMsg) {
        notification = new TextMorph(
            this.ide.cloudMsg,
            10,
            null, // style
            false, // bold
            null, // italic
            null, // alignment
            null, // width
            null, // font name
            new Point(1, 1), // shadow offset
            new Color(255, 255, 255) // shadowColor
        );
        notification.refresh = nop;
        this.srcBar.add(notification);
    }

    this.addSourceButton('cloud', localize('Cloud'), 'cloud');
    if (this.task === 'open') {
        this.addSourceButton('cloud-shared', localize('Shared with me'), 'cloud');
        baseSize.y += 50;
    }
    this.addSourceButton('local', localize('Browser'), 'storage');
    if (this.task === 'open') {
        this.buildFilterField();
        this.addSourceButton('examples', localize('Examples'), 'poster');
    }
    this.srcBar.fixLayout();
    this.body.add(this.srcBar);

    if (this.task === 'save') {
        this.nameField = new InputFieldMorph(this.ide.room.name);
        this.body.add(this.nameField);
    }

    this.listField = new ListMorph([]);
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.body.add(this.listField);

    this.preview = new Morph();
    this.preview.fixLayout = nop;
    this.preview.edge = InputFieldMorph.prototype.edge;
    this.preview.fontSize = InputFieldMorph.prototype.fontSize;
    this.preview.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.preview.contrast = InputFieldMorph.prototype.contrast;
    this.preview.drawNew = function () {
        InputFieldMorph.prototype.drawNew.call(this);
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };
    this.preview.drawCachedTexture = function () {
        var context = this.image.getContext('2d');
        var scale = Math.min(
            (this.width() / this.cachedTexture.width),
            (this.height() / this.cachedTexture.height)
            ),
            width = scale * this.cachedTexture.width,
            height = scale * this.cachedTexture.height;

        context.drawImage(this.cachedTexture, this.edge, this.edge,
            width, height);

        this.changed();
    };
    this.preview.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;
    this.preview.setExtent(
        this.ide.serializer.thumbnailSize.divideBy(4).add(this.preview.edge * 2)
    );

    this.body.add(this.preview);
    this.preview.drawNew();
    if (this.task === 'save') {
        thumbnail = this.ide.stage.thumbnail(
            SnapSerializer.prototype.thumbnailSize
        );
        this.preview.texture = null;
        this.preview.cachedTexture = thumbnail;
        this.preview.drawCachedTexture();
    }

    this.notesField = new ScrollFrameMorph();
    this.notesField.fixLayout = nop;

    this.notesField.edge = InputFieldMorph.prototype.edge;
    this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
    this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.notesField.contrast = InputFieldMorph.prototype.contrast;
    this.notesField.drawNew = InputFieldMorph.prototype.drawNew;
    this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.notesField.acceptsDrops = false;
    this.notesField.contents.acceptsDrops = false;

    if (this.task === 'open') {
        this.notesText = new TextMorph('');
    } else { // 'save'
        this.notesText = new TextMorph(this.ide.projectNotes);
        this.notesText.isEditable = true;
        this.notesText.enableSelecting();
    }

    this.notesField.isTextLineWrapping = true;
    this.notesField.padding = 3;
    this.notesField.setContents(this.notesText);
    this.notesField.setWidth(this.preview.width());

    this.body.add(this.notesField);

    if (this.task === 'open') {
        this.addButton('openProject', 'Open');
        this.action = 'openProject';
    } else { // 'save'
        this.addButton('saveProject', 'Save');
        this.action = 'saveProject';
    }
    this.shareButton = this.addButton('shareProject', 'Share');
    this.unshareButton = this.addButton('unshareProject', 'Unshare');
    this.shareButton.hide();
    this.unshareButton.hide();
    this.deleteButton = this.addButton('deleteProject', 'Delete');
    this.addButton('cancel', 'Cancel');

    if (notification) {
        this.setExtent(baseSize.add(notification.extent()));
    } else {
        this.setExtent(baseSize);
    }
    this.fixLayout();
};

ProjectDialogMorph.prototype.popUp = function (wrrld) {
    var world = wrrld || this.ide.world();
    if (world) {
        ProjectDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            350,
            300,
            this.corner,
            this.corner
        );
    }
};

// ProjectDialogMorph source buttons

ProjectDialogMorph.prototype.addSourceButton = function (
    source,
    label,
    symbol
) {
    var myself = this,
        lbl1 = new StringMorph(
            label,
            10,
            null,
            true,
            null,
            null,
            new Point(1, 1),
            new Color(255, 255, 255)
        ),
        lbl2 = new StringMorph(
            label,
            10,
            null,
            true,
            null,
            null,
            new Point(-1, -1),
            this.titleBarColor.darker(50),
            new Color(255, 255, 255)
        ),
        l1 = new Morph(),
        l2 = new Morph(),
        button;

    lbl1.add(new SymbolMorph(
        symbol,
        24,
        this.titleBarColor.darker(20),
        new Point(1, 1),
        this.titleBarColor.darker(50)
    ));
    lbl1.children[0].setCenter(lbl1.center());
    lbl1.children[0].setBottom(lbl1.top() - this.padding / 2);

    l1.image = lbl1.fullImage();
    l1.bounds = lbl1.fullBounds();

    lbl2.add(new SymbolMorph(
        symbol,
        24,
        new Color(255, 255, 255),
        new Point(-1, -1),
        this.titleBarColor.darker(50)
    ));
    lbl2.children[0].setCenter(lbl2.center());
    lbl2.children[0].setBottom(lbl2.top() - this.padding / 2);

    l2.image = lbl2.fullImage();
    l2.bounds = lbl2.fullBounds();

    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the ProjectDialog is the target
        function () { // action
            myself.setSource(source);
        },
        [l1, l2],
        function () {  // query
            return myself.source === source;
        }
    );

    button.corner = this.buttonCorner;
    button.edge = this.buttonEdge;
    button.outline = this.buttonOutline;
    button.outlineColor = this.buttonOutlineColor;
    button.outlineGradient = this.buttonOutlineGradient;
    button.labelMinExtent = new Point(60, 0);
    button.padding = this.buttonPadding;
    button.contrast = this.buttonContrast;
    button.pressColor = this.titleBarColor.darker(20);

    button.drawNew();
    button.fixLayout();
    button.refresh();
    this.srcBar.add(button);
};

// ProjectDialogMorph list field control

ProjectDialogMorph.prototype.fixListFieldItemColors = function () {
    // remember to always fixLayout() afterwards for the changes
    // to take effect
    var myself = this;
    this.listField.contents.children[0].alpha = 0;
    this.listField.contents.children[0].children.forEach(function (item) {
        item.pressColor = myself.titleBarColor.darker(20);
        item.color = new Color(0, 0, 0, 0);
        item.noticesTransparentClick = true;
    });
};

// ProjectDialogMorph filter field

ProjectDialogMorph.prototype.buildFilterField = function () {
    var myself = this;

    this.filterField = new InputFieldMorph('');
    this.magnifiyingGlass =
        new SymbolMorph(
            'magnifiyingGlass',
            this.filterField.height(),
            this.titleBarColor.darker(50));

    this.body.add(this.magnifiyingGlass);
    this.body.add(this.filterField);

    this.filterField.reactToKeystroke = function (evt) {
        var text = this.getValue();

        myself.listField.elements =
            myself.projectList.filter(function (aProject) {
                var name,
                    notes;

                if (aProject.ProjectName) { // cloud
                    name = aProject.ProjectName;
                    notes = aProject.Notes;
                } else { // local or examples
                    name = aProject.name;
                    notes = aProject.notes || '';
                }

                return name.toLowerCase().indexOf(text.toLowerCase()) > -1 ||
                    notes.toLowerCase().indexOf(text.toLowerCase()) > -1;
            });

        if (myself.listField.elements.length === 0) {
            myself.listField.elements.push('(no matches)');
        }

        myself.clearDetails();
        myself.listField.buildListContents();
        myself.fixListFieldItemColors();
        myself.listField.adjustScrollBars();
        myself.listField.scrollY(myself.listField.top());
        myself.fixLayout();
    };
};

// ProjectDialogMorph ops

ProjectDialogMorph.prototype.setSource = function (source) {
    var myself = this,
        msg;

    this.source = source; //this.task === 'save' ? 'local' : source;
    this.srcBar.children.forEach(function (button) {
        button.refresh();
    });
    switch (this.source) {
        case 'cloud':
            msg = myself.ide.showMessage('Updating\nproject list...');
            this.projectList = [];
            SnapCloud.getProjectList(
                function (projectList) {
                    // Don't show cloud projects if user has since switch panes.
                    if (myself.source === 'cloud') {
                        myself.installCloudProjectList(projectList);
                    }
                    msg.destroy();
                },
                function (err, lbl) {
                    msg.destroy();
                    myself.ide.cloudError().call(null, err, lbl);
                }
            );
            return;
        case 'cloud-shared':
            msg = myself.ide.showMessage('Updating\nproject list...');
            this.projectList = [];
            SnapCloud.getSharedProjectList(
                function (projectList) {
                    // Don't show cloud projects if user has since switch panes.
                    if (myself.source === 'cloud-shared') {
                        myself.installSharedCloudProjectList(projectList);
                    }
                    msg.destroy();
                },
                function (err, lbl) {
                    msg.destroy();
                    myself.ide.cloudError().call(null, err, lbl);
                }
            );
            return;
        case 'examples':
            this.projectList = this.getExamplesProjectList();
            break;
        case 'local':
            this.projectList = this.getLocalProjectList();
            break;
    }

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
        this.projectList.length > 0 ?
            function (element) {
                return element.name || element;
            } : null,
        null,
        function () {myself.ok(); }
    );

    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    if (this.source === 'local') {
        this.listField.action = function (item) {
            var src, xml;

            if (item === undefined) {return; }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            if (myself.task === 'open') {

                src = localStorage['-snap-project-' + item.name];

                if (src) {
                    xml = myself.ide.serializer.parse(src);
                    // Select a role to display
                    xml = xml.children[0].children[0];

                    myself.notesText.text = xml.childNamed('notes').contents
                        || '';
                    myself.notesText.drawNew();
                    myself.notesField.contents.adjustBounds();
                    myself.preview.texture =
                        xml.childNamed('thumbnail').contents || null;
                    myself.preview.cachedTexture = null;
                    myself.preview.drawNew();
                }
            }
            myself.edit();
        };
    } else { // 'examples'; 'cloud' is initialized elsewhere
        this.listField.action = function (item) {
            var src, xml;
            if (item === undefined) {return; }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            src = myself.ide.getURL(
                myself.ide.resourceURL('Examples', item.fileName)
            );

            xml = myself.ide.serializer.parse(src);
            xml = xml.children[0].children[0];  // get project info of first role
            myself.notesText.text = xml.childNamed('notes').contents
                || '';
            myself.notesText.drawNew();
            myself.notesField.contents.adjustBounds();
            myself.preview.texture = xml.childNamed('thumbnail').contents
                || null;
            myself.preview.cachedTexture = null;
            myself.preview.drawNew();
            myself.edit();
        };
    }
    this.body.add(this.listField);
    this.shareButton.hide();
    this.unshareButton.hide();
    if (this.source === 'local') {
        this.deleteButton.show();
    } else { // examples
        this.deleteButton.hide();
    }
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open') {
        this.clearDetails();
    }
};

ProjectDialogMorph.prototype.getLocalProjectList = function () {
    var stored, name, dta,
        projects = [];
    for (stored in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, stored)
            && stored.substr(0, 14) === '-snap-project-') {
            name = stored.substr(14);
            dta = {
                name: name,
                thumb: null,
                notes: null
            };
            projects.push(dta);
        }
    }
    projects.sort(function (x, y) {
        return x.name.toLowerCase() < y.name.toLowerCase() ? -1 : 1;
    });
    return projects;
};

ProjectDialogMorph.prototype.getExamplesProjectList = function () {
    return this.ide.getMediaList('Examples');
};

ProjectDialogMorph.prototype.installSharedCloudProjectList = function (pl) {
    var myself = this;
    this.projectList = pl || [];
    this.projectList.sort(function (x, y) {
        return x.ProjectName.toLowerCase() < y.ProjectName.toLowerCase() ?
            -1 : 1;
    });

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
        this.projectList.length > 0 ?
            function (element) {
                return element.ProjectName || element;
            } : null,
        [ // format: display shared project names bold
            [
                'bold',
                function (proj) {return proj.Public === 'true'; }
            ]
        ],
        function () {myself.ok(); }
    );
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.listField.action = function (item) {
        if (item === undefined) {return; }
        if (myself.nameField) {
            myself.nameField.setContents(item.ProjectName || '');
        }
        if (myself.task === 'open') {
            myself.notesText.text = item.Notes || '';
            myself.notesText.drawNew();
            myself.notesField.contents.adjustBounds();
            myself.preview.texture = item.Thumbnail || null;
            myself.preview.cachedTexture = null;
            myself.preview.drawNew();
            (new SpeechBubbleMorph(new TextMorph(
                localize('owner') + ': ' + item.Owner + '\n' +
                localize('last changed') + '\n' + item.Updated,
                null,
                null,
                null,
                null,
                'center'
            ))).popUp(
                myself.world(),
                myself.preview.rightCenter().add(new Point(2, 0))
            );
        }
        if (item.Public === 'true') {
            myself.shareButton.hide();
            myself.unshareButton.show();
        } else {
            myself.unshareButton.hide();
            myself.shareButton.show();
        }
        myself.buttons.fixLayout();
        myself.fixLayout();
        myself.edit();
    };
    this.body.add(this.listField);
    this.shareButton.show();
    this.unshareButton.hide();
    this.deleteButton.show();
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open') {
        this.clearDetails();
    }
};

ProjectDialogMorph.prototype.installCloudProjectList = function (pl) {
    var myself = this;
    this.projectList = pl || [];
    this.projectList.sort(function (x, y) {
        return x.ProjectName.toLowerCase() < y.ProjectName.toLowerCase() ?
            -1 : 1;
    });

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
        this.projectList.length > 0 ?
            function (element) {
                return element.ProjectName || element;
            } : null,
        [ // format: display shared project names bold
            [
                'bold',
                function (proj) {return proj.Public === 'true'; }
            ]
        ],
        function () {myself.ok(); }
    );
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.listField.action = function (item) {
        if (item === undefined) {return; }
        if (myself.nameField) {
            myself.nameField.setContents(item.ProjectName || '');
        }
        if (myself.task === 'open') {
            myself.notesText.text = item.Notes || '';
            myself.notesText.drawNew();
            myself.notesField.contents.adjustBounds();
            myself.preview.texture = item.Thumbnail || null;
            myself.preview.cachedTexture = null;
            myself.preview.drawNew();
            (new SpeechBubbleMorph(new TextMorph(
                localize('last changed') + '\n' + item.Updated,
                null,
                null,
                null,
                null,
                'center'
            ))).popUp(
                myself.world(),
                myself.preview.rightCenter().add(new Point(2, 0))
            );
        }
        if (item.Public === 'true') {
            myself.shareButton.hide();
            myself.unshareButton.show();
        } else {
            myself.unshareButton.hide();
            myself.shareButton.show();
        }
        myself.buttons.fixLayout();
        myself.fixLayout();
        myself.edit();
    };
    this.body.add(this.listField);
    this.shareButton.show();
    this.unshareButton.hide();
    this.deleteButton.show();
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open') {
        this.clearDetails();
    }
};

ProjectDialogMorph.prototype.clearDetails = function () {
    this.notesText.text = '';
    this.notesText.drawNew();
    this.notesField.contents.adjustBounds();
    this.preview.texture = null;
    this.preview.cachedTexture = null;
    this.preview.drawNew();
};

ProjectDialogMorph.prototype.openProject = function () {
    var proj = this.listField.selected,
        src;
    console.log("1proj: "+JSON.stringify(proj))
    // var proj = {"ProjectName":"t1_public","Public":"true","Updated":"Tue Mar 09 2021 23:34:19 GMT-0500 (Eastern Standard Time)","Notes":"","Thumbnail":"http://localhost:8080/api/projects/t1/t1_public/thumbnail","Owner":"t1","ID":"60484bb0bb6bcc17072fb542"}

    if (!proj) {return; }
    this.ide.source = this.source;
    if (this.source === 'cloud') {
        console.log("1_2 proj: "+JSON.stringify(proj))
        this.openCloudProject(proj);
    } else if (this.source === 'examples') {
        // Note "file" is a property of the parseResourceFile function.
        src = this.ide.getURL(this.ide.resourceURL('Examples', proj.fileName));
        SnapActions.disableCollaboration();
        SnapUndo.reset();
        this.ide.openProjectString(src);
        this.destroy();
    } else { // 'local'
        
        this.ide.openProject(proj.name);
        this.destroy();
    }
};

ProjectDialogMorph.prototype.openCloudProject = function (project) {
    var myself = this;
    myself.ide.nextSteps([
        function () {
            myself.ide.showMessage('Fetching project\nfrom the cloud...');
        },
        function () {
            myself.rawOpenCloudProject(project);
            console.log("2proj: "+JSON.stringify(project))
        }
    ]);
};

ProjectDialogMorph.prototype.rawOpenCloudProject = function (proj) {
    var myself = this;
    SnapCloud.reconnect(
        function () {
            SnapCloud.callService(
                'getRawProject',
                function (response) {
                    console.log("3proj: "+JSON.stringify(proj))
                    SnapCloud.disconnect();
                    /*
                    if (myself.world().currentKey === 16) {
                        myself.ide.download(response);
                        return;
                    }
                    */
                    myself.ide.source = 'cloud';
                    myself.ide.droppedText(response);
                    if (proj.Public === 'true') {
                        console.log("4proj: "+JSON.stringify(proj))
                        location.hash = '#present:Username=' +
                            encodeURIComponent(SnapCloud.username) +
                            '&ProjectName=' +
                            encodeURIComponent(proj.ProjectName);
                        console.log("5encodeURIComponent: "+JSON.stringify(location.hash))
                    }
                },
                myself.ide.cloudError(),
                [proj.ProjectName]
            );
        },
        myself.ide.cloudError()
    );
    this.destroy();
};

ProjectDialogMorph.prototype.saveProject = function () {
    var name = this.nameField.contents().text.text,
        notes = this.notesText.text,
        myself = this;

    this.ide.projectNotes = notes || this.ide.projectNotes;
    if (/[\.@]+/.test(name)) {
        this.ide.inform(
            'Invalid Project Name',
            'Could not save project because\n' +
            'the provided name contains illegal characters.',
            this.world()
        );
        return;
    }

    if (this.source === 'cloud') {
        if (detect(
            this.projectList,
            function (item) {return item.ProjectName === name; }
        )) {
            this.ide.confirm(
                localize(
                    'Are you sure you want to replace'
                ) + '\n"' + name + '"?',
                'Replace Project',
                function () {
                    myself.saveCloudProject(name);
                    timeout1 = window.setTimeout(function() {myself.saveProject();}, 30000);
                }
            );
        } else {
            myself.saveCloudProject(name);
            timeout1 = window.setTimeout(function() {myself.saveProject();}, 30000);
        }
    } else { // 'local'
        if (detect(
            this.projectList,
            function (item) {return item.name === name; }
        )) {
            this.ide.confirm(
                localize(
                    'Are you sure you want to replace'
                ) + '\n"' + name + '"?',
                'Replace Project',
                function () {
                    myself.ide.room.name = name;
                    myself.ide.source = 'local';
                    myself.ide.saveProject(name);
                    myself.destroy();
                }
            );
        } else {
            this.ide.room.name = name;
            myself.ide.source = 'local';
            this.ide.saveProject(name);
            this.destroy();
        }
    }
};

ProjectDialogMorph.prototype.saveCloudProject = function (name) {
    var myself = this;
    this.ide.showMessage('Saving project\nto the cloud...');
    SnapCloud.saveProject(
        this.ide,
        function (result) {
            if (result.name) {
                myself.ide.room.silentSetRoomName(result.name);
            }
            myself.ide.source = 'cloud';
            myself.ide.showMessage('Saved to cloud!', 2);
        },
        this.ide.cloudError(),
        true,
        name
    );
    this.destroy();
};

ProjectDialogMorph.prototype.deleteProject = function () {
    var myself = this,
        proj,
        idx,
        name;

    if (this.source === 'cloud') {
        proj = this.listField.selected;
        if (proj) {
            this.ide.confirm(
                localize(
                    'Are you sure you want to delete'
                ) + '\n"' + proj.ProjectName + '"?',
                'Delete Project',
                function () {
                    SnapCloud.reconnect(
                        function () {
                            SnapCloud.callService(
                                'deleteProject',
                                function () {
                                    SnapCloud.disconnect();
                                    myself.ide.hasChangedMedia = true;
                                    idx = myself.projectList.indexOf(proj);
                                    myself.projectList.splice(idx, 1);
                                    myself.installCloudProjectList(
                                        myself.projectList
                                    ); // refresh list
                                },
                                myself.ide.cloudError(),
                                [proj.ProjectName]
                            );
                        },
                        myself.ide.cloudError()
                    );
                }
            );
        }
    } else { // 'local, examples'
        if (this.listField.selected) {
            name = this.listField.selected.name;
            this.ide.confirm(
                localize(
                    'Are you sure you want to delete'
                ) + '\n"' + name + '"?',
                'Delete Project',
                function () {
                    delete localStorage['-snap-project-' + name];
                    myself.setSource(myself.source); // refresh list
                }
            );
        }
    }
};

ProjectDialogMorph.prototype.shareProject = function () {
    var myself = this,
        ide = this.ide,
        proj = this.listField.selected,
        entry = this.listField.active;

    if (proj) {
        this.ide.confirm(
            localize(
                'Are you sure you want to publish'
            ) + '\n"' + proj.ProjectName + '"?',
            'Share Project',
            function () {
                myself.ide.showMessage('sharing\nproject...');
                SnapCloud.reconnect(
                    function () {
                        SnapCloud.callService(
                            'publishProject',
                            function () {
                                SnapCloud.disconnect();
                                proj.Public = 'true';
                                myself.unshareButton.show();
                                myself.shareButton.hide();
                                entry.label.isBold = true;
                                entry.label.drawNew();
                                entry.label.changed();
                                myself.buttons.fixLayout();
                                myself.drawNew();
                                myself.ide.showMessage('shared.', 2);
                            },
                            myself.ide.cloudError(),
                            [proj.ProjectName]
                        );
                        // Set the Shared URL if the project is currently open
                        if (proj.ProjectName === ide.projectName) {
                            var usr = SnapCloud.username,
                                projectId = 'Username=' +
                                    encodeURIComponent(usr.toLowerCase()) +
                                    '&ProjectName=' +
                                    encodeURIComponent(proj.ProjectName);
                            location.hash = 'present:' + projectId;
                        }
                    },
                    myself.ide.cloudError()
                );
            }
        );
    }
};

ProjectDialogMorph.prototype.unshareProject = function () {
    var myself = this,
        ide = this.ide,
        proj = this.listField.selected,
        entry = this.listField.active;


    if (proj) {
        this.ide.confirm(
            localize(
                'Are you sure you want to unpublish'
            ) + '\n"' + proj.ProjectName + '"?',
            'Unshare Project',
            function () {
                myself.ide.showMessage('unsharing\nproject...');
                SnapCloud.reconnect(
                    function () {
                        SnapCloud.callService(
                            'unpublishProject',
                            function () {
                                SnapCloud.disconnect();
                                proj.Public = 'false';
                                myself.shareButton.show();
                                myself.unshareButton.hide();
                                entry.label.isBold = false;
                                entry.label.drawNew();
                                entry.label.changed();
                                myself.buttons.fixLayout();
                                myself.drawNew();
                                myself.ide.showMessage('unshared.', 2);
                            },
                            myself.ide.cloudError(),
                            [proj.ProjectName]
                        );
                        // Remove the shared URL if the project is open.
                        if (proj.ProjectName === ide.projectName) {
                            location.hash = '';
                        }
                    },
                    myself.ide.cloudError()
                );
            }
        );
    }
};

ProjectDialogMorph.prototype.edit = function () {
    if (this.nameField) {
        this.nameField.edit();
    } else if (this.filterField) {
        this.filterField.edit();
    }
};

// ProjectDialogMorph layout

ProjectDialogMorph.prototype.fixLayout = function () {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        thin = this.padding / 2,
        inputField = this.nameField || this.filterField,
        oldFlag = Morph.prototype.trackChanges;

    Morph.prototype.trackChanges = false;

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.fixLayout();
    }

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            th + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height() - this.padding * 3 - th - this.buttons.height()
        ));
        this.srcBar.setPosition(this.body.position());

        inputField.setWidth(
            this.body.width() - this.srcBar.width() - this.padding * 6
        );
        inputField.setLeft(this.srcBar.right() + this.padding * 3);
        inputField.setTop(this.srcBar.top());
        inputField.drawNew();

        this.listField.setLeft(this.srcBar.right() + this.padding);
        this.listField.setWidth(
            this.body.width()
            - this.srcBar.width()
            - this.preview.width()
            - this.padding
            - thin
        );
        this.listField.contents.children[0].adjustWidths();

        this.listField.setTop(inputField.bottom() + this.padding);
        this.listField.setHeight(
            this.body.height() - inputField.height() - this.padding
        );

        if (this.magnifiyingGlass) {
            this.magnifiyingGlass.setTop(inputField.top());
            this.magnifiyingGlass.setLeft(this.listField.left());
        }

        this.preview.setRight(this.body.right());
        this.preview.setTop(inputField.bottom() + this.padding);

        this.notesField.setTop(this.preview.bottom() + thin);
        this.notesField.setLeft(this.preview.left());
        this.notesField.setHeight(
            this.body.bottom() - this.preview.bottom() - thin
        );
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
    }

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    Morph.prototype.trackChanges = oldFlag;
    this.changed();
};

// LibraryImportDialogMorph ///////////////////////////////////////////
// I am preview dialog shown before importing a library.
// I inherit from a DialogMorph but look similar to
// ProjectDialogMorph, and BlockImportDialogMorph

LibraryImportDialogMorph.prototype = new DialogBoxMorph();
LibraryImportDialogMorph.prototype.constructor = LibraryImportDialogMorph;
LibraryImportDialogMorph.uber = DialogBoxMorph.prototype;

// LibraryImportDialogMorph instance creation:

function LibraryImportDialogMorph(ide, librariesData) {
    this.init(ide, librariesData);
}

LibraryImportDialogMorph.prototype.init = function (ide, librariesData) {
    // initialize inherited properties:
    LibraryImportDialogMorph.uber.init.call(
        this,
        this, // target
        null, // function
        null  // environment
    );

    this.ide = ide;
    this.key = 'importLibrary';
    this.librariesData = librariesData; // [{name: , fileName: , description:}]

    // I contain a cached version of the libaries I have displayed,
    // because users may choose to explore a library many times before
    // importing.
    this.libraryCache = {}; // {fileName: [blocks-array] }

    this.handle = null;
    this.listField = null;
    this.palette = null;
    this.notesText = null;
    this.notesField = null;

    this.labelString = 'Import library';
    this.createLabel();

    this.buildContents();
};

LibraryImportDialogMorph.prototype.buildContents = function () {
    this.addBody(new Morph());
    this.body.color = this.color;

    this.initializePalette();
    this.initializeLibraryDescription();
    this.installLibrariesList();

    this.addButton('importLibrary', 'Import');
    this.addButton('cancel', 'Cancel');

    this.setExtent(new Point(460, 455));
    this.fixLayout();
};

LibraryImportDialogMorph.prototype.initializePalette = function () {
    // I will display a scrolling list of blocks.
    if (this.palette) {this.palette.destroy(); }

    this.palette = new ScrollFrameMorph(
        null,
        null,
        SpriteMorph.prototype.sliderColor
    );
    this.palette.color = SpriteMorph.prototype.paletteColor;
    this.palette.padding = 4;
    this.palette.isDraggable = false;
    this.palette.acceptsDrops = false;
    this.palette.contents.acceptsDrops = false;

    this.body.add(this.palette);
};

LibraryImportDialogMorph.prototype.initializeLibraryDescription = function () {
    if (this.notesField) {this.notesField.destroy(); }

    this.notesField = new ScrollFrameMorph();
    this.notesField.fixLayout = nop;

    this.notesField.edge = InputFieldMorph.prototype.edge;
    this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
    this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.notesField.contrast = InputFieldMorph.prototype.contrast;
    this.notesField.drawNew = InputFieldMorph.prototype.drawNew;
    this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.notesField.acceptsDrops = false;
    this.notesField.contents.acceptsDrops = false;

    this.notesText = new TextMorph('');

    this.notesField.isTextLineWrapping = true;
    this.notesField.padding = 3;
    this.notesField.setContents(this.notesText);
    this.notesField.setHeight(100);

    this.body.add(this.notesField);
};

LibraryImportDialogMorph.prototype.installLibrariesList = function () {
    var myself = this;

    if (this.listField) {this.listField.destroy(); }

    this.listField = new ListMorph(
        this.librariesData,
        function (element) {return element.name; },
        null,
        function () {myself.importLibrary(); }
    );

    this.fixListFieldItemColors();

    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.listField.action = function (item) {
        if (isNil(item)) {return; }

        myself.notesText.text = item.description || '';
        myself.notesText.drawNew();
        myself.notesField.contents.adjustBounds();

        if (myself.hasCached(item.fileName)) {
            myself.displayBlocks(item.fileName);
        } else {
            myself.showMessage(
                localize('Loading') + '\n' + localize(item.name)
            );
            myself.ide.getURL(
                myself.ide.resourceURL('libraries', item.fileName),
                function(libraryXML) {
                    myself.cacheLibrary(
                        item.fileName,
                        myself.ide.serializer.loadBlocks(libraryXML)
                    );
                    myself.displayBlocks(item.fileName);
                }
            );
        }
    };

    this.listField.setWidth(200);
    this.body.add(this.listField);

    this.fixLayout();
};

LibraryImportDialogMorph.prototype.popUp = function () {
    var world = this.ide.world();
    if (world) {
        LibraryImportDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            300,
            300,
            this.corner,
            this.corner
        );
    }
};

LibraryImportDialogMorph.prototype.fixListFieldItemColors =
    ProjectDialogMorph.prototype.fixListFieldItemColors;

LibraryImportDialogMorph.prototype.clearDetails =
    ProjectDialogMorph.prototype.clearDetails;

LibraryImportDialogMorph.prototype.fixLayout = function () {
    var titleHeight = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        thin = this.padding / 2,
        oldFlag = Morph.prototype.trackChanges;

    Morph.prototype.trackChanges = false;

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            titleHeight + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height()
            - this.padding * 3 // top, bottom and button padding.
            - titleHeight
            - this.buttons.height()
        ));

        this.listField.setExtent(new Point(
            200,
            this.body.height()
        ));
        this.notesField.setExtent(new Point(
            this.body.width() - this.listField.width() - thin,
            100
        ));
        this.palette.setExtent(new Point(
            this.notesField.width(),
            this.body.height() - this.notesField.height() - thin
        ));
        this.listField.contents.children[0].adjustWidths();

        this.listField.setPosition(this.body.position());
        this.palette.setPosition(this.listField.topRight().add(
            new Point(thin, 0)
        ));
        this.notesField.setPosition(this.palette.bottomLeft().add(
            new Point(0, thin)
        ));
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(
            this.top() + (titleHeight - this.label.height()) / 2
        );
    }

    if (this.buttons) {
        this.buttons.fixLayout();
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    Morph.prototype.trackChanges = oldFlag;
    this.changed();
};

// Library Cache Utilities.
LibraryImportDialogMorph.prototype.hasCached = function (key) {
    return this.libraryCache.hasOwnProperty(key);
};

LibraryImportDialogMorph.prototype.cacheLibrary = function (key, blocks) {
    this.libraryCache[key] = blocks ;
};

LibraryImportDialogMorph.prototype.cachedLibrary = function (key) {
    return this.libraryCache[key];
};

LibraryImportDialogMorph.prototype.importLibrary = function () {
    var ide = this.ide,
        selectedLibrary = this.listField.selected.fileName,
        libraryName = this.listField.selected.name;

    ide.showMessage(localize('Loading') + ' ' + localize(libraryName));
    ide.getURL(
        ide.resourceURL('libraries', selectedLibrary),
        function(libraryText) {
            ide.droppedText(libraryText, libraryName);
        }
    );

    this.destroy();
};

LibraryImportDialogMorph.prototype.displayBlocks = function (libraryKey) {
    var x, y, blockImage, previousCategory, blockContainer,
        myself = this,
        padding = 4,
        blocksList = this.cachedLibrary(libraryKey);

    if (!blocksList.length) {return; }
    // populate palette, grouped by categories.
    this.initializePalette();
    x = this.palette.left() + padding;
    y = this.palette.top();

    SpriteMorph.prototype.categories.forEach(function (category) {
        blocksList.forEach(function (definition) {
            if (definition.category !== category) {return; }
            if (category !== previousCategory) {
                y += padding;
            }
            previousCategory = category;

            blockImage = definition.templateInstance().fullImage();
            blockContainer = new Morph();
            blockContainer.setExtent(
                new Point(blockImage.width, blockImage.height)
            );
            blockContainer.image = blockImage;
            blockContainer.setPosition(new Point(x, y));
            myself.palette.addContents(blockContainer);

            y += blockContainer.fullBounds().height() + padding;
        });
    });

    this.palette.scrollX(padding);
    this.palette.scrollY(padding);
    this.fixLayout();
};

LibraryImportDialogMorph.prototype.showMessage = function (msgText) {
    var msg = new MenuMorph(null, msgText);
    this.initializePalette();
    this.fixLayout();
    msg.popUpCenteredInWorld(this.palette.contents);
};

// SpriteIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm respresenting, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// SpriteIconMorph inherits from ToggleButtonMorph (Widgets)

SpriteIconMorph.prototype = new ToggleButtonMorph();
SpriteIconMorph.prototype.constructor = SpriteIconMorph;
SpriteIconMorph.uber = ToggleButtonMorph.prototype;

// SpriteIconMorph settings

SpriteIconMorph.prototype.thumbSize = new Point(40, 40);
SpriteIconMorph.prototype.labelShadowOffset = null;
SpriteIconMorph.prototype.labelShadowColor = null;
SpriteIconMorph.prototype.labelColor = new Color(255, 255, 255);
SpriteIconMorph.prototype.fontSize = 9;

// SpriteIconMorph instance creation:

function SpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
}

SpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
    var colors, action, query, hover, myself = this;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        // make my sprite the current one
        var ide = myself.parentThatIsA(IDE_Morph);

        if (ide) {
            SnapActions.selectSprite(myself.object);
            ide.selectSprite(myself.object);
        }
    };

    query = function () {
        // answer true if my sprite is the current one
        var ide = myself.parentThatIsA(IDE_Morph);

        if (ide) {
            return ide.currentSprite === myself.object;
        }
        return false;
    };

    hover = function () {
        if (!aSprite.exemplar) {return null; }
        return (localize('parent' + ':\n' + aSprite.exemplar.name));
    };

    // additional properties:
    this.object = aSprite || new SpriteMorph(); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;
    this.rotationButton = null; // synchronous rotation of nested sprites

    // initialize inherited properties:
    SpriteIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        hover, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

SpriteIconMorph.prototype.createThumbnail = function () {
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }

    this.thumbnail = new Morph();
    this.thumbnail.setExtent(this.thumbSize);
    if (this.object instanceof SpriteMorph) { // support nested sprites
        this.thumbnail.image = this.object.fullThumbnail(this.thumbSize);
        this.createRotationButton();
    } else {
        this.thumbnail.image = this.object.thumbnail(this.thumbSize);
    }
    this.add(this.thumbnail);
};

SpriteIconMorph.prototype.createLabel = function () {
    var txt;

    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        this.object.name,
        this.fontSize,
        this.fontStyle,
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

SpriteIconMorph.prototype.createRotationButton = function () {
    var button, myself = this;

    if (this.rotationButton) {
        this.rotationButton.destroy();
        this.roationButton = null;
    }
    if (!this.object.anchor) {
        return;
    }

    button = new ToggleButtonMorph(
        null, // colors,
        null, // target
        function () {
            myself.object.rotatesWithAnchor =
                !myself.object.rotatesWithAnchor;
        },
        [
            '\u2192',
            '\u21BB'
        ],
        function () {  // query
            return myself.object.rotatesWithAnchor;
        }
    );

    button.corner = 8;
    button.labelMinExtent = new Point(11, 11);
    button.padding = 0;
    button.pressColor = button.color;
    button.drawNew();
    // button.hint = 'rotate synchronously\nwith anchor';
    button.fixLayout();
    button.refresh();
    button.changed();
    this.rotationButton = button;
    this.add(this.rotationButton);
};

// SpriteIconMorph stepping

SpriteIconMorph.prototype.step = function () {
    if (this.version !== this.object.version) {
        this.createThumbnail();
        this.createLabel();
        this.fixLayout();
        this.version = this.object.version;
        this.refresh();
    }
};

// SpriteIconMorph layout

SpriteIconMorph.prototype.fixLayout = function () {
    if (!this.thumbnail || !this.label) {return null; }

    this.setWidth(
        this.thumbnail.width()
        + this.outline * 2
        + this.edge * 2
        + this.padding * 2
    );

    this.setHeight(
        this.thumbnail.height()
        + this.outline * 2
        + this.edge * 2
        + this.padding * 3
        + this.label.height()
    );

    this.thumbnail.setCenter(this.center());
    this.thumbnail.setTop(
        this.top() + this.outline + this.edge + this.padding
    );

    if (this.rotationButton) {
        this.rotationButton.setTop(this.top());
        this.rotationButton.setRight(this.right());
    }

    this.label.setWidth(
        Math.min(
            this.label.children[0].width(), // the actual text
            this.thumbnail.width()
        )
    );
    this.label.setCenter(this.center());
    this.label.setTop(
        this.thumbnail.bottom() + this.padding
    );
};

// SpriteIconMorph menu

SpriteIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this),
        myself = this;
    if (this.object instanceof StageMorph) {
        menu.addItem(
            'pic...',
            function () {
                var ide = myself.parentThatIsA(IDE_Morph);
                ide.saveCanvasAs(
                    myself.object.fullImageClassic(),
                    this.object.name
                );
            },
            'download a picture of the stage'
        );
        return menu;
    }
    if (!(this.object instanceof SpriteMorph)) {return null; }
    menu.addItem("show", 'showSpriteOnStage');
    menu.addLine();
    menu.addItem("duplicate", function() {
        var position = myself.world().hand.position();

        SnapActions.duplicateSprite(
            myself.object,
            position
        );
    });
    menu.addItem("delete", function() {
        SnapActions.removeSprite(this.object);
    });
    menu.addLine();
    if (StageMorph.prototype.enableInheritance) {
        menu.addItem("parent...", 'chooseExemplar');
    }
    if (this.object.anchor) {
        menu.addItem(
            localize('detach from') + ' ' + this.object.anchor.name,
            function() {
                SnapActions.detachParts([this.object]);
            }
        );
    }
    if (this.object.parts.length) {
        menu.addItem(
            'detach all parts',
            function() {
                SnapActions.detachParts(this.object.parts);
            }
        );
    }
    menu.addItem("export...", 'exportSprite');
    return menu;
};

SpriteIconMorph.prototype.exportSprite = function () {
    this.object.exportSprite();
};

SpriteIconMorph.prototype.chooseExemplar = function () {
    this.object.chooseExemplar();
};

SpriteIconMorph.prototype.showSpriteOnStage = function () {
    this.object.showOnStage();
};

// SpriteIconMorph drawing

SpriteIconMorph.prototype.createBackgrounds = function () {
//    only draw the edges if I am selected
    var context,
        ext = this.extent();

    if (this.template) { // take the backgrounds images from the template
        this.image = this.template.image;
        this.normalImage = this.template.normalImage;
        this.highlightImage = this.template.highlightImage;
        this.pressImage = this.template.pressImage;
        return null;
    }

    this.normalImage = newCanvas(ext);
    context = this.normalImage.getContext('2d');
    this.drawBackground(context, this.color);

    this.highlightImage = newCanvas(ext);
    context = this.highlightImage.getContext('2d');
    this.drawBackground(context, this.highlightColor);

    this.pressImage = newCanvas(ext);
    context = this.pressImage.getContext('2d');
    this.drawOutline(context);
    this.drawBackground(context, this.pressColor);
    this.drawEdges(
        context,
        this.pressColor,
        this.pressColor.lighter(this.contrast),
        this.pressColor.darker(this.contrast)
    );

    this.image = this.normalImage;
};

// SpriteIconMorph drag & drop

SpriteIconMorph.prototype.prepareToBeGrabbed = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        idx;
    this.mouseClickLeft(); // select me
    this.alpha = 0.85;
    if (ide) {
        idx = ide.sprites.asArray().indexOf(this.object);
        ide.sprites.remove(idx + 1);
        ide.createCorral();
        ide.fixLayout();
    }
};

SpriteIconMorph.prototype.justDropped = function () {
    this.alpha = 1;
};

SpriteIconMorph.prototype.wantsDropOf = function (morph) {
    // allow scripts & media to be copied from one sprite to another
    // by drag & drop
    return morph instanceof BlockMorph
        || (morph instanceof CostumeIconMorph)
        || (morph instanceof SoundIconMorph);
};

SpriteIconMorph.prototype.reactToDropOf = function (morph, hand) {
    if (morph instanceof BlockMorph) {
        this.copyStack(morph);
    } else if (morph instanceof CostumeIconMorph) {
        this.copyCostume(morph.object);
    } else if (morph instanceof SoundIconMorph) {
        this.copySound(morph.object);
    }
    this.world().add(morph);
    morph.slideBackTo(hand.grabOrigin);
};

SpriteIconMorph.prototype.copyStack = function (block) {
    var dup = block.fullCopy(),
        // FIXME: This positioning can be problematic...
        y = Math.max(this.object.scripts.children.map(function (stack) {
            return stack.fullBounds().bottom();
        }).concat([this.object.scripts.top()])),
        position = new Point(this.object.scripts.left() + 20, y + 20);

    dup.setPosition(position);
    dup.allComments().forEach(function (comment) {
        comment.align(dup);
    });

    // delete all custom blocks pointing to local definitions
    // under construction...
    dup.allChildren().forEach(function (morph) {
        if (morph.definition && !morph.definition.isGlobal) {
            morph.deleteBlock();
        }
    });

    dup.id = null;
    SnapActions.addBlock(dup, this.object.scripts, position);
};

SpriteIconMorph.prototype.copyCostume = function (costume) {
    var dup = costume.copy(),
        serialized;

    dup.name = this.object.newCostumeName(dup.name);
    SnapActions.addCostume(dup, this.object);
};

SpriteIconMorph.prototype.copySound = function (sound) {
    SnapActions.addSound(sound, this.object);
};

// CostumeIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
    a self-updating thumbnail of the costume I'm respresenting, and a
    self-updating label of the costume's name (in case it is changed
    elsewhere)
*/

// CostumeIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

CostumeIconMorph.prototype = new ToggleButtonMorph();
CostumeIconMorph.prototype.constructor = CostumeIconMorph;
CostumeIconMorph.uber = ToggleButtonMorph.prototype;

// CostumeIconMorph settings

CostumeIconMorph.prototype.thumbSize = new Point(80, 60);
CostumeIconMorph.prototype.labelShadowOffset = null;
CostumeIconMorph.prototype.labelShadowColor = null;
CostumeIconMorph.prototype.labelColor = new Color(255, 255, 255);
CostumeIconMorph.prototype.fontSize = 9;

// CostumeIconMorph instance creation:

function CostumeIconMorph(aCostume, aTemplate) {
    this.init(aCostume, aTemplate);
}

CostumeIconMorph.prototype.init = function (aCostume, aTemplate) {
    var colors, action, query, myself = this;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        // make my costume the current one
        var ide = myself.parentThatIsA(IDE_Morph),
            wardrobe = myself.parentThatIsA(WardrobeMorph);

        if (ide) {
            ide.currentSprite.wearCostume(myself.object);
        }
        if (wardrobe) {
            wardrobe.updateSelection();
        }
    };

    query = function () {
        // answer true if my costume is the current one
        var ide = myself.parentThatIsA(IDE_Morph);

        if (ide) {
            return ide.currentSprite.costume === myself.object;
        }
        return false;
    };

    // additional properties:
    this.object = aCostume || new Costume(); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    CostumeIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

CostumeIconMorph.prototype.createThumbnail
    = SpriteIconMorph.prototype.createThumbnail;

CostumeIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// CostumeIconMorph stepping

CostumeIconMorph.prototype.step
    = SpriteIconMorph.prototype.step;

// CostumeIconMorph layout

CostumeIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// CostumeIconMorph menu

CostumeIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    if (!(this.object instanceof Costume)) {return null; }
    menu.addItem("edit", "editCostume");
    if (this.world().currentKey === 16) { // shift clicked
        menu.addItem(
            'edit rotation point only...',
            'editRotationPointOnly',
            null,
            new Color(100, 0, 0)
        );
    }
    menu.addItem("rename", "renameCostume");
    menu.addLine();
    menu.addItem("duplicate", "duplicateCostume");
    menu.addItem("delete", "removeCostume");
    menu.addLine();
    menu.addItem("export", "exportCostume");
    return menu;
};

CostumeIconMorph.prototype.editCostume = function () {
    var myself = this,
        original = this.object.copy(),
        updateCostume = function() {
            SnapActions.updateCostume(original, myself.object);
        };

    if (this.object instanceof SVG_Costume) {
        this.object.editRotationPointOnly(this.world(), updateCostume);
    } else {
        this.object.edit(
            this.world(),
            this.parentThatIsA(IDE_Morph),
            false, // not a new costume, retain existing rotation center
            null,
            updateCostume
        );
    }
};

CostumeIconMorph.prototype.editRotationPointOnly = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    this.object.editRotationPointOnly(this.world());
    ide.hasChangedMedia = true;
};

CostumeIconMorph.prototype.renameCostume = function () {
    var costume = this.object,
        wardrobe = this.parentThatIsA(WardrobeMorph),
        ide = this.parentThatIsA(IDE_Morph);
    new DialogBoxMorph(
        null,
        function (answer) {
            if (answer && (answer !== costume.name)) {
                var newName = wardrobe.sprite.newCostumeName(
                    answer,
                    costume
                );
                SnapActions.renameCostume(costume, newName);
            }
        }
    ).prompt(
        this.currentSprite instanceof SpriteMorph ?
            'rename costume' : 'rename background',
        costume.name,
        this.world()
    );
};

CostumeIconMorph.prototype.duplicateCostume = function () {
    var wardrobe = this.parentThatIsA(WardrobeMorph),
        ide = this.parentThatIsA(IDE_Morph),
        newcos = this.object.copy();

    newcos.name = wardrobe.sprite.newCostumeName(newcos.name);
    SnapActions.addCostume(newcos, wardrobe.sprite);
};

CostumeIconMorph.prototype.removeCostume = function () {
    SnapActions.removeCostume(this.object);
};

CostumeIconMorph.prototype.exportCostume = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (this.object instanceof SVG_Costume) {
        // don't show SVG costumes in a new tab (shows text)
        ide.saveFileAs(this.object.contents.src, 'text/svg', this.object.name);
    } else { // rasterized Costume
        ide.saveCanvasAs(this.object.contents, this.object.name);
    }
};

// CostumeIconMorph drawing

CostumeIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

// CostumeIconMorph drag & drop

CostumeIconMorph.prototype.prepareToBeGrabbed = function () {
    this.mouseClickLeft(); // select me
    this.localRemoveCostume();
};

CostumeIconMorph.prototype.localRemoveCostume = function () {
    // Only remove the costume locally for the drag
    var wardrobe = this.parentThatIsA(WardrobeMorph),
        idx = this.parent.children.indexOf(this),
        ide = this.parentThatIsA(IDE_Morph);

    wardrobe.removeCostumeAt(idx - 2);
    if (ide.currentSprite.costume === this.object) {
        ide.currentSprite.wearCostume(null);
    }
};

// TurtleIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
    a thumbnail of the sprite's or stage's default "Turtle" costume.
*/

// TurtleIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

TurtleIconMorph.prototype = new ToggleButtonMorph();
TurtleIconMorph.prototype.constructor = TurtleIconMorph;
TurtleIconMorph.uber = ToggleButtonMorph.prototype;

// TurtleIconMorph settings

TurtleIconMorph.prototype.thumbSize = new Point(80, 60);
TurtleIconMorph.prototype.labelShadowOffset = null;
TurtleIconMorph.prototype.labelShadowColor = null;
TurtleIconMorph.prototype.labelColor = new Color(255, 255, 255);
TurtleIconMorph.prototype.fontSize = 9;

// TurtleIconMorph instance creation:

function TurtleIconMorph(aSpriteOrStage, aTemplate) {
    this.init(aSpriteOrStage, aTemplate);
}

TurtleIconMorph.prototype.init = function (aSpriteOrStage, aTemplate) {
    var colors, action, query, myself = this;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        // make my costume the current one
        var ide = myself.parentThatIsA(IDE_Morph),
            wardrobe = myself.parentThatIsA(WardrobeMorph);

        if (ide) {
            ide.currentSprite.wearCostume(null);
        }
        if (wardrobe) {
            wardrobe.updateSelection();
        }
    };

    query = function () {
        // answer true if my costume is the current one
        var ide = myself.parentThatIsA(IDE_Morph);

        if (ide) {
            return ide.currentSprite.costume === null;
        }
        return false;
    };

    // additional properties:
    this.object = aSpriteOrStage; // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    TurtleIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        'default', // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = false;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
};

TurtleIconMorph.prototype.createThumbnail = function () {
    var isFlat = MorphicPreferences.isFlat;

    if (this.thumbnail) {
        this.thumbnail.destroy();
    }
    if (this.object instanceof SpriteMorph) {
        this.thumbnail = new SymbolMorph(
            'turtle',
            this.thumbSize.y,
            this.labelColor,
            isFlat ? null : new Point(-1, -1),
            new Color(0, 0, 0)
        );
    } else {
        this.thumbnail = new SymbolMorph(
            'stage',
            this.thumbSize.y,
            this.labelColor,
            isFlat ? null : new Point(-1, -1),
            new Color(0, 0, 0)
        );
    }
    this.add(this.thumbnail);
};

TurtleIconMorph.prototype.createLabel = function () {
    var txt;

    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        localize(
            this.object instanceof SpriteMorph ? 'Turtle' : 'Empty'
        ),
        this.fontSize,
        this.fontStyle,
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

// TurtleIconMorph layout

TurtleIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// TurtleIconMorph drawing

TurtleIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

// TurtleIconMorph user menu

TurtleIconMorph.prototype.userMenu = function () {
    var myself = this,
        menu = new MenuMorph(this, 'pen'),
        on = '\u25CF',
        off = '\u25CB';
    if (this.object instanceof StageMorph) {
        return null;
    }
    menu.addItem(
        (this.object.penPoint === 'tip' ? on : off) + ' ' + localize('tip'),
        function () {
            myself.object.penPoint = 'tip';
            myself.object.changed();
            myself.object.drawNew();
            myself.object.changed();
        }
    );
    menu.addItem(
        (this.object.penPoint === 'middle' ? on : off) + ' ' + localize(
        'middle'
        ),
        function () {
            myself.object.penPoint = 'middle';
            myself.object.changed();
            myself.object.drawNew();
            myself.object.changed();
        }
    );
    return menu;
};

// WardrobeMorph ///////////////////////////////////////////////////////

// I am a watcher on a sprite's costume list

// WardrobeMorph inherits from ScrollFrameMorph

WardrobeMorph.prototype = new ScrollFrameMorph();
WardrobeMorph.prototype.undoCategory = 'costumes';
WardrobeMorph.prototype.constructor = WardrobeMorph;
WardrobeMorph.uber = ScrollFrameMorph.prototype;

// WardrobeMorph settings

// ... to follow ...

// WardrobeMorph instance creation:

function WardrobeMorph(aSprite, sliderColor) {
    this.init(aSprite, sliderColor);
}

WardrobeMorph.prototype.init = function (aSprite, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.costumesVersion = null;
    this.spriteVersion = null;

    // initialize inherited properties
    WardrobeMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    this.fps = 2;
    this.updateList();
};

// Wardrobe updating

WardrobeMorph.prototype.updateList = function () {
    var myself = this,
        x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        oldFlag = Morph.prototype.trackChanges,
        oldPos = this.contents.position(),
        icon,
        template,
        txt,
        paintbutton;

    this.changed();
    oldFlag = Morph.prototype.trackChanges;
    Morph.prototype.trackChanges = false;

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = function (icon) {
        myself.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    icon = new TurtleIconMorph(this.sprite);
    icon.setPosition(new Point(x, y));
    myself.addContents(icon);
    y = icon.bottom() + padding;

    paintbutton = new PushButtonMorph(
        this,
        "paintNew",
        new SymbolMorph("brush", 15)
    );
    paintbutton.padding = 0;
    paintbutton.corner = 12;
    paintbutton.color = IDE_Morph.prototype.groupColor;
    paintbutton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
    paintbutton.pressColor = paintbutton.highlightColor;
    paintbutton.labelMinExtent = new Point(36, 18);
    paintbutton.labelShadowOffset = new Point(-1, -1);
    paintbutton.labelShadowColor = paintbutton.highlightColor;
    paintbutton.labelColor = TurtleIconMorph.prototype.labelColor;
    paintbutton.contrast = this.buttonContrast;
    paintbutton.drawNew();
    paintbutton.hint = "Paint a new costume";
    paintbutton.setPosition(new Point(x, y));
    paintbutton.fixLayout();
    paintbutton.setCenter(icon.center());
    paintbutton.setLeft(icon.right() + padding * 4);


    this.addContents(paintbutton);

    txt = new TextMorph(localize(
        "costumes tab help" // look up long string in translator
    ));
    txt.fontSize = 9;
    txt.setColor(SpriteMorph.prototype.paletteTextColor);

    txt.setPosition(new Point(x, y));
    this.addContents(txt);
    y = txt.bottom() + padding;


    this.sprite.costumes.asArray().forEach(function (costume) {
        template = icon = new CostumeIconMorph(costume, template);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        y = icon.bottom() + padding;
    });
    this.costumesVersion = this.sprite.costumes.lastChanged;

    this.contents.setPosition(oldPos);
    this.adjustScrollBars();
    Morph.prototype.trackChanges = oldFlag;
    this.changed();

    this.updateSelection();
    this.onNextStep = this.updateUndoControls;
};

WardrobeMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {morph.refresh(); }
    });
    this.spriteVersion = this.sprite.version;
};

// Wardrobe stepping

WardrobeMorph.prototype.step = function () {
    if (this.costumesVersion !== this.sprite.costumes.lastChanged) {
        this.updateList();
    }
    if (this.spriteVersion !== this.sprite.version) {
        this.updateSelection();
    }
};

// Wardrobe ops

WardrobeMorph.prototype.removeCostumeAt = function (idx) {
    this.sprite.costumes.remove(idx);
    this.updateList();
};

WardrobeMorph.prototype.paintNew = function () {
    var name = this.sprite.newCostumeName(localize('Untitled')),
        ide = this.parentThatIsA(IDE_Morph),
        myself = this,
        cos = new Costume(
            newCanvas(null, true),
            name
        );

    cos.edit(this.world(), ide, true, null, function () {
        SnapActions.addCostume(cos, myself.sprite);
    });
};

// Wardrobe drag & drop

WardrobeMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof CostumeIconMorph;
};

WardrobeMorph.prototype.reactToDropOf = function (icon) {
    var idx = 0,
        costume = icon.object,
        top = icon.top();

    icon.destroy();
    this.contents.children.forEach(function (item) {
        if (item instanceof CostumeIconMorph && item.top() < top - 4) {
            idx += 1;
        }
    });
    this.sprite.costumes.add(costume, idx + 1);
    this.updateList();
    icon.mouseClickLeft(); // select
};

// Undo/Redo support
WardrobeMorph.prototype.updateUndoControls =
    ScriptsMorph.prototype.updateUndoControls;

WardrobeMorph.prototype.addUndoControls =
    ScriptsMorph.prototype.addUndoControls;

WardrobeMorph.prototype.undoOwnerId =
    ScriptsMorph.prototype.undoOwnerId;

WardrobeMorph.prototype.definitionOrSprite = function() {
    return this.sprite;
};

// SoundIconMorph ///////////////////////////////////////////////////////

/*
    I am an element in the SpriteEditor's "Sounds" tab.
*/

// SoundIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

SoundIconMorph.prototype = new ToggleButtonMorph();
SoundIconMorph.prototype.constructor = SoundIconMorph;
SoundIconMorph.uber = ToggleButtonMorph.prototype;

// SoundIconMorph settings

SoundIconMorph.prototype.thumbSize = new Point(80, 60);
SoundIconMorph.prototype.labelShadowOffset = null;
SoundIconMorph.prototype.labelShadowColor = null;
SoundIconMorph.prototype.labelColor = new Color(255, 255, 255);
SoundIconMorph.prototype.fontSize = 9;

// SoundIconMorph instance creation:

function SoundIconMorph(aSound, aTemplate) {
    this.init(aSound, aTemplate);
}

SoundIconMorph.prototype.init = function (aSound, aTemplate) {
    var colors, action, query;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        nop(); // When I am selected (which is never the case for sounds)
    };

    query = function () {
        return false;
    };

    // additional properties:
    this.object = aSound; // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    SoundIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

SoundIconMorph.prototype.createThumbnail = function () {
    var label;
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }
    this.thumbnail = new Morph();
    this.thumbnail.setExtent(this.thumbSize);
    this.add(this.thumbnail);
    label = new StringMorph(
        this.createInfo(),
        '16',
        '',
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        new Color(200, 200, 200)
    );
    this.thumbnail.add(label);
    label.setCenter(new Point(40, 15));

    this.button = new PushButtonMorph(
        this,
        'toggleAudioPlaying',
        (this.object.previewAudio ? 'Stop' : 'Play')
    );
    this.button.drawNew();
    this.button.hint = 'Play sound';
    this.button.fixLayout();
    this.thumbnail.add(this.button);
    this.button.setCenter(new Point(40, 40));
};

SoundIconMorph.prototype.createInfo = function () {
    var dur = Math.round(this.object.audio.duration || 0),
        mod = dur % 60;
    return Math.floor(dur / 60).toString()
        + ":"
        + (mod < 10 ? "0" : "")
        + mod.toString();
};

SoundIconMorph.prototype.toggleAudioPlaying = function () {
    var myself = this;
    if (!this.object.previewAudio) {
        //Audio is not playing
        this.button.labelString = 'Stop';
        this.button.hint = 'Stop sound';
        this.object.previewAudio = this.object.play();
        this.object.previewAudio.addEventListener('ended', function () {
            myself.audioHasEnded();
        }, false);
    } else {
        //Audio is currently playing
        this.button.labelString = 'Play';
        this.button.hint = 'Play sound';
        this.object.previewAudio.pause();
        this.object.previewAudio.terminated = true;
        this.object.previewAudio = null;
    }
    this.button.createLabel();
};

SoundIconMorph.prototype.audioHasEnded = function () {
    this.button.trigger();
    this.button.mouseLeave();
};

SoundIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// SoundIconMorph stepping

/*
SoundIconMorph.prototype.step
    = SpriteIconMorph.prototype.step;
*/

// SoundIconMorph layout

SoundIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// SoundIconMorph menu

SoundIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    if (!(this.object instanceof Sound)) { return null; }
    menu.addItem('rename', 'renameSound');
    menu.addItem('delete', 'removeSound');
    return menu;
};


SoundIconMorph.prototype.renameSound = function () {
    var sound = this.object,
        ide = this.parentThatIsA(IDE_Morph),
        myself = this;
    (new DialogBoxMorph(
        null,
        function (answer) {
            if (answer && (answer !== sound.name)) {
                SnapActions.renameSound(sound, answer);
            }
        }
    )).prompt(
        'rename sound',
        sound.name,
        this.world()
    );
};

SoundIconMorph.prototype.removeSound = function () {
    SnapActions.removeSound(this.object);
};

SoundIconMorph.prototype.localRemoveSound = function () {
    var jukebox = this.parentThatIsA(JukeboxMorph),
        idx = this.parent.children.indexOf(this);
    jukebox.removeSound(idx);
};

SoundIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

SoundIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// SoundIconMorph drag & drop

SoundIconMorph.prototype.prepareToBeGrabbed = function () {
    this.localRemoveSound();
};

// JukeboxMorph /////////////////////////////////////////////////////

/*
    I am JukeboxMorph, like WardrobeMorph, but for sounds
*/

// JukeboxMorph instance creation

JukeboxMorph.prototype = new ScrollFrameMorph();
JukeboxMorph.prototype.undoCategory = 'sounds';
JukeboxMorph.prototype.constructor = JukeboxMorph;
JukeboxMorph.uber = ScrollFrameMorph.prototype;

function JukeboxMorph(aSprite, sliderColor) {
    this.init(aSprite, sliderColor);
}

JukeboxMorph.prototype.init = function (aSprite, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.costumesVersion = null;
    this.spriteVersion = null;

    // initialize inherited properties
    JukeboxMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    this.acceptsDrops = false;
    this.fps = 2;
    this.updateList();
};

// Jukebox updating

JukeboxMorph.prototype.updateList = function () {
    var myself = this,
        x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        oldFlag = Morph.prototype.trackChanges,
        icon,
        template,
        txt;

    this.changed();
    oldFlag = Morph.prototype.trackChanges;
    Morph.prototype.trackChanges = false;

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = function (icon) {
        myself.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    txt = new TextMorph(localize(
        'import a sound from your computer\nby dragging it into here'
    ));
    txt.fontSize = 9;
    txt.setColor(SpriteMorph.prototype.paletteTextColor);
    txt.setPosition(new Point(x, y));
    this.addContents(txt);
    y = txt.bottom() + padding;

    this.sprite.sounds.asArray().forEach(function (sound) {
        template = icon = new SoundIconMorph(sound, template);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        y = icon.bottom() + padding;
    });

    Morph.prototype.trackChanges = oldFlag;
    this.changed();

    this.updateSelection();
    this.onNextStep = this.updateUndoControls;
};

JukeboxMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {morph.refresh(); }
    });
    this.spriteVersion = this.sprite.version;
};

// Jukebox stepping

/*
JukeboxMorph.prototype.step = function () {
    if (this.spriteVersion !== this.sprite.version) {
        this.updateSelection();
    }
};
*/

// Jukebox ops

JukeboxMorph.prototype.removeSound = function (idx) {
    this.sprite.sounds.remove(idx);
    this.updateList();
};

// Jukebox drag & drop

JukeboxMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof SoundIconMorph;
};

JukeboxMorph.prototype.reactToDropOf = function (icon) {
    var idx = 0,
        costume = icon.object,
        top = icon.top();

    icon.destroy();
    this.contents.children.forEach(function (item) {
        if (item.top() < top - 4) {
            idx += 1;
        }
    });
    this.sprite.sounds.add(costume, idx);
    this.updateList();
};

// Undo/Redo support
JukeboxMorph.prototype.updateUndoControls =
    ScriptsMorph.prototype.updateUndoControls;

JukeboxMorph.prototype.addUndoControls =
    ScriptsMorph.prototype.addUndoControls;

JukeboxMorph.prototype.undoOwnerId =
    ScriptsMorph.prototype.undoOwnerId;

JukeboxMorph.prototype.definitionOrSprite = function() {
    return this.sprite;
};

// StageHandleMorph ////////////////////////////////////////////////////////

// I am a horizontal resizing handle for a StageMorph

// StageHandleMorph inherits from Morph:

StageHandleMorph.prototype = new Morph();
StageHandleMorph.prototype.constructor = StageHandleMorph;
StageHandleMorph.uber = Morph.prototype;

// StageHandleMorph instance creation:

function StageHandleMorph(target) {
    this.init(target);
}

StageHandleMorph.prototype.init = function (target) {
    this.target = target || null;
    HandleMorph.uber.init.call(this);
    this.color = MorphicPreferences.isFlat ?
        IDE_Morph.prototype.groupColor : new Color(190, 190, 190);
    this.isDraggable = false;
    this.noticesTransparentClick = true;
    this.setExtent(new Point(12, 50));
};

// StageHandleMorph drawing:

StageHandleMorph.prototype.drawNew = function () {
    this.normalImage = newCanvas(this.extent());
    this.highlightImage = newCanvas(this.extent());
    this.drawOnCanvas(
        this.normalImage,
        this.color
    );
    this.drawOnCanvas(
        this.highlightImage,
        MorphicPreferences.isFlat ?
            new Color(245, 245, 255) : new Color(100, 100, 255),
        this.color
    );
    this.image = this.normalImage;
    this.fixLayout();
};

StageHandleMorph.prototype.drawOnCanvas = function (
    aCanvas,
    color,
    shadowColor
) {
    var context = aCanvas.getContext('2d'),
        l = aCanvas.height / 8,
        w = aCanvas.width / 6,
        r = w / 2,
        x,
        y,
        i;

    context.lineWidth = w;
    context.lineCap = 'round';
    y = aCanvas.height / 2;

    context.strokeStyle = color.toString();
    x = aCanvas.width / 12;
    for (i = 0; i < 3; i += 1) {
        if (i > 0) {
            context.beginPath();
            context.moveTo(x, y - (l - r));
            context.lineTo(x, y + (l - r));
            context.stroke();
        }
        x += (w * 2);
        l *= 2;
    }
    if (shadowColor) {
        context.strokeStyle = shadowColor.toString();
        x = aCanvas.width / 12 + w;
        l = aCanvas.height / 8;
        for (i = 0; i < 3; i += 1) {
            if (i > 0) {
                context.beginPath();
                context.moveTo(x, y - (l - r));
                context.lineTo(x, y + (l - r));
                context.stroke();
            }
            x += (w * 2);
            l *= 2;
        }
    }
};

// StageHandleMorph layout:

StageHandleMorph.prototype.fixLayout = function () {
    if (!this.target) {return; }
    var ide = this.target.parentThatIsA(IDE_Morph);
    this.setTop(this.target.top() + 10);
    this.setRight(this.target.left());
    if (ide) {ide.add(this); } // come to front
};

// StageHandleMorph stepping:

StageHandleMorph.prototype.step = null;

StageHandleMorph.prototype.mouseDownLeft = function (pos) {
    var world = this.world(),
        offset = this.right() - pos.x,
        myself = this,
        ide = this.target.parentThatIsA(IDE_Morph);

    if (!this.target) {
        return null;
    }
    ide.isSmallStage = true;
    ide.controlBar.stageSizeButton.refresh();
    this.step = function () {
        var newPos, newWidth;
        if (world.hand.mouseButton) {
            newPos = world.hand.bounds.origin.x + offset;
            newWidth = myself.target.right() - newPos;
            ide.stageRatio = newWidth / myself.target.dimensions.x;
            ide.setExtent(world.extent());

        } else {
            this.step = null;
            ide.isSmallStage = (ide.stageRatio !== 1);
            ide.controlBar.stageSizeButton.refresh();
        }
    };
};

// StageHandleMorph events:

StageHandleMorph.prototype.mouseEnter = function () {
    this.image = this.highlightImage;
    this.changed();
};

StageHandleMorph.prototype.mouseLeave = function () {
    this.image = this.normalImage;
    this.changed();
};

StageHandleMorph.prototype.mouseDoubleClick = function () {
    this.target.parentThatIsA(IDE_Morph).toggleStageSize(true, 1);
};

// PaletteHandleMorph ////////////////////////////////////////////////////////

// I am a horizontal resizing handle for a blocks palette
// I pseudo-inherit many things from StageHandleMorph

// PaletteHandleMorph inherits from Morph:

PaletteHandleMorph.prototype = new Morph();
PaletteHandleMorph.prototype.constructor = PaletteHandleMorph;
PaletteHandleMorph.uber = Morph.prototype;

// PaletteHandleMorph instance creation:

function PaletteHandleMorph(target) {
    this.init(target);
}

PaletteHandleMorph.prototype.init = function (target) {
    this.target = target || null;
    HandleMorph.uber.init.call(this);
    this.color = MorphicPreferences.isFlat ?
        new Color(255, 255, 255) : new Color(190, 190, 190);
    this.isDraggable = false;
    this.noticesTransparentClick = true;
    this.setExtent(new Point(12, 50));
};

// PaletteHandleMorph drawing:

PaletteHandleMorph.prototype.drawNew =
    StageHandleMorph.prototype.drawNew;

PaletteHandleMorph.prototype.drawOnCanvas =
    StageHandleMorph.prototype.drawOnCanvas;

// PaletteHandleMorph layout:

PaletteHandleMorph.prototype.fixLayout = function () {
    if (!this.target) {return; }
    var ide = this.target.parentThatIsA(IDE_Morph);
    this.setTop(this.target.top() + 10);
    this.setRight(this.target.right());
    if (ide) {ide.add(this); } // come to front
};

// PaletteHandleMorph stepping:

PaletteHandleMorph.prototype.step = null;

PaletteHandleMorph.prototype.mouseDownLeft = function (pos) {
    var world = this.world(),
        offset = this.right() - pos.x,
        ide = this.target.parentThatIsA(IDE_Morph);

    if (!this.target) {
        return null;
    }
    this.step = function () {
        var newPos;
        if (world.hand.mouseButton) {
            newPos = world.hand.bounds.origin.x + offset;
            ide.paletteWidth = Math.min(
                Math.max(200, newPos),
                ide.stageHandle.left() - ide.spriteBar.tabBar.width()
            );
            ide.setExtent(world.extent());

        } else {
            this.step = null;
        }
    };
};

// PaletteHandleMorph events:

PaletteHandleMorph.prototype.mouseEnter
    = StageHandleMorph.prototype.mouseEnter;

PaletteHandleMorph.prototype.mouseLeave
    = StageHandleMorph.prototype.mouseLeave;

PaletteHandleMorph.prototype.mouseDoubleClick = function () {
    this.target.parentThatIsA(IDE_Morph).setPaletteWidth(200);
};
