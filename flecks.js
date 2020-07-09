var convoNum = 1;

/* Conversation 1 */
var conversationHistory;
var futureConversation;

var speakerHistory;
var futureSpeaker;
var futureAudio;

conversationHistory = [];

futureConversation = ["Hi, I’m Viviana. But you can call me Vivi.",
"My name's Jeremy, but you can call me Jay.",
"We heard you will be coding today.",
"We did some coding at our school too!",
"We were partners, and you're gonna have a partner too.",
"Good luck!"];

futureAudio = ["1_Viviana_HiImVivianaButYouCanCallMeVivi.mp3",
"2_Jeremy_MyNamesJeremy_TAKE1.mp3",
"3_Viviana_WeHeardYouWouldBeCodingToday.mp3",
"4_Jeremy_WeDidSomeCodingAtOurSchoolToo_TAKE1.mp3",
"5_Viviana_WeWerePartners.mp3",
"6_Jeremy_GoodLuck_TAKE1.mp3"];

futureImages = [];

speakerHistory = [];
futureSpeaker = ['v', 'j','v','j','v','j'];

/* Conversation 2 */
var futureConversation2;

var futureSpeaker2;


futureConversation2 = ["Jeremy, we did debugging in school too, right?",
"Yeah, we did.",
"I remember we couldn’t figure out that one activity, but we eventually got it."];

futureAudio2 = ["1_Viviana_JeremyWeDidDebuggingInSchool.mp3",
"2_Jeremy_YeahWeDid_TAKE1.mp3",
"3_Jeremy_IRememberWeCouldnt_TAKE1.mp3"];

futureSpeaker2 = ['v', 'j','j'];

/* Conversation 3 */
var futureConversation3;
var speakerHistory3;
var futureSpeaker3;
var futureAudio3;


futureConversation3 = ["Aagh. The sprite’s not jumping.",
"O yeah. I think we need to change the ‘y’ position.",
"But, why?",
"'Cause that will make it move up and down.",
"Oh that actually worked!",
"We’re so good at this!"];

futureAudio3 = ["4_Jeremy_AghTheSpritesNotJumping_TAKE1.mp3",
"5_Viviana_IThinkWeNeedToChangeTheYPosition.mp3",
"6_Jeremy_ButWhy_TAKE1.mp3",
"7_Viviana_CauseThatWillMakeItMoveUpAndDown.mp3",
"8_Jeremy_OhThatActuallyWorked_TAKE2.mp3",
"9_Viviana_WeAreSoGoodAtThis.mp3"];

futureSpeaker3 = ['j','v','j','v','j','v'];

/* Conversation 4 */

var speakerHistory4;
var futureSpeaker4;
var futureConversation4;

futureConversation4 = ["I’ll type five seconds into the move block to make our sprite go super fast.",
"Wait, that didn't work.",
"Gimme that. I can fix it.",
"Viviana! I was working on it.",
"Sorry. I just think typing “1 second” will make it go real quick.",
"Oh, good idea.",
"Cool, look at it go!"];

futureAudio4 = ["1_Jeremy_IllTypeintoTheMoveBlock_TAKE1.mp4",
"2_Jeremy_WaitThatDidntWork_TAKE1.mp3",
"3_Viviana_GimmeThatICanFixIt.mp3",
"4_Jeremy_VivianaIWasWorkingOnIt_TAKE1.mp3",
"5_Viviana_Sorry.mp3"];

futureSpeaker4 = ['j','j', 'v', 'j','v','j'];

/* Conversation 5 */

var speakerHistory5;
var futureSpeaker5;
var futureConversation5;

futureConversation5 = ["Vivi, I’m going to put these blocks over here.",
"That’s not what we’re supposed to do.",
"Wait.",
"Oh. Our sprite’s doing nothing.",
"We've got to put this “say” block inside that 'if' block, so the sprite will say 'Hi!'.",
"Sorry, my bad.",
"Let me drag the “say” block over here, and…",
"Boom! There we go!"];

futureAudio5 = ["1_Jeremy_ViviImGonnaPutTheseBlocks_TAKE1.mp3",
"2_Viviana_ThatsNotWhatWeAreSupposedToDo.mp3",
"3_Jeremy_Wait_TAKE1.mp3",
"4_Jeremy_OhOurSpritesDoingNothing_TAKE2.mp3",
"5_Viviana_WeHaveToPutThatSayBlock.mp3",
"6_Jeremy_SorryMyBad_TAKE1.mp3",
"7_Jeremy_LetMeDragTheSayBlock_TAKE1.mp3",
"8_Viviana_BoomThereWeGo.mp3"];

futureSpeaker5 = ['j','v','j','j','v','j','j','v'];

FLECKSMorph.prototype = new IDE_Morph();
FLECKSMorph.prototype.constructor = FLECKSMorph;
FLECKSMorph.uber = IDE_Morph.prototype;

FLECKSMorph.prototype.init = function (isAutoFill) {
    // Create the websocket manager
    //this.sockets = new WebSocketManager(this);
    //this.room = null;

    // initialize inherited properties:
    //NetsBloxMorph.uber.init.call(this, isAutoFill);
    //this.serializer = new NetsBloxSerializer();

    var myself = this;
    // attach the event listeners
    window.addEventListener('ideLoaded', function() {
        if (!(myself.isSupportedBrowser())) myself.showBrowserNotification();
    });
};

FLECKSMorph.prototype.buildPanes = function () {
    //this.createRoom();
    //NetsBloxMorph.uber.buildPanes.call(this);
};

FLECKSMorph.prototype.toggleAgentImage = function (convoNum) {
    console.log("In IDE_Morph.prototype.toggleAgentImage");

    this.isOriginalAgent = !this.isOriginalAgent;
    var moreConvo= false;
    var audio = '/audio/';

    if (convoNum == 1) {
      if (futureConversation.length > 0) {
        var currentUtterance = futureConversation[0];
        futureConversation.shift();
        conversationHistory.push(currentUtterance);
        audio = audio + futureAudio[0];
        futureAudio.shift();
        moreConvo= true;
      }

      if (futureSpeaker.length > 0) {
        var currentSpeaker = futureSpeaker[0];
        futureSpeaker.shift();
        speakerHistory.push(currentSpeaker);

        BlockMorph.prototype.snapSound = document.createElement('audio');
        BlockMorph.prototype.snapSound.src = audio;//'/audio/' + futureAudio[0];
        BlockMorph.prototype.snapSound.play();
      }
    } else if (convoNum == 2) {
      if (futureConversation2.length > 0) {
        var currentUtterance2 = futureConversation2[0];
        futureConversation2.shift();
        conversationHistory.push(currentUtterance2);
        audio = audio + futureAudio2[0];
        console.log("AUDIO " + audio);
        futureAudio2.shift();
        moreConvo = true;
      }

      if (futureSpeaker2.length > 0) {
        var currentSpeaker2 = futureSpeaker2[0];
        futureSpeaker2.shift();
        speakerHistory.push(currentSpeaker2);

        BlockMorph.prototype.snapSound = document.createElement('audio');
        BlockMorph.prototype.snapSound.src = audio;
        BlockMorph.prototype.snapSound.play();
      }
    } else if (convoNum == 3) {
      if (futureConversation3.length > 0) {
        var currentUtterance3 = futureConversation3[0];
        futureConversation3.shift();
        conversationHistory.push(currentUtterance3);
        audio = audio + futureAudio3[0];
        console.log("AUDIO " + audio);
        futureAudio3.shift();
        moreConvo = true;
      }

      if (futureSpeaker3.length > 0) {
        var currentSpeaker3 = futureSpeaker3[0];
        futureSpeaker3.shift();
        speakerHistory.push(currentSpeaker3);

        BlockMorph.prototype.snapSound = document.createElement('audio');
        BlockMorph.prototype.snapSound.src = audio;//'click.wav';
        BlockMorph.prototype.snapSound.play();
      }
    } else if (convoNum == 4) {
      if (futureConversation4.length > 0) {
        var currentUtterance4 = futureConversation4[0];
        futureConversation4.shift();
        conversationHistory.push(currentUtterance4);
        audio = audio + futureAudio4[0];
        console.log("AUDIO " + audio);
        futureAudio4.shift();
        moreConvo = true;
      }

      if (futureSpeaker4.length > 0) {
        var currentSpeaker4 = futureSpeaker4[0];
        futureSpeaker4.shift();
        speakerHistory.push(currentSpeaker4);

        BlockMorph.prototype.snapSound = document.createElement('audio');
        BlockMorph.prototype.snapSound.src = audio;//'click.wav';
        BlockMorph.prototype.snapSound.play();
      }

    } else if (convoNum == 5) {
      if (futureConversation5.length > 0) {
        var currentUtterance5 = futureConversation5[0];
        futureConversation5.shift();
        conversationHistory.push(currentUtterance5);
        audio = audio + futureAudio5[0];
        console.log("AUDIO " + audio);
        futureAudio5.shift();
        moreConvo = true;
      }

      if (futureSpeaker5.length > 0) {
        var currentSpeaker5 = futureSpeaker5[0];
        futureSpeaker5.shift();
        speakerHistory.push(currentSpeaker5);

        BlockMorph.prototype.snapSound = document.createElement('audio');
        BlockMorph.prototype.snapSound.src = audio;//'click.wav';
        BlockMorph.prototype.snapSound.play();
      }
    }

    this.createSpeechBubblePanel();


    //Here is where we modify the agent image to change
    if (this.isOriginalAgent) {
      this.createAgentPanel();
    } else {
      this.createAgentPanelFlipped();
    }

    if (this.isLargeAgent) {
      SnapActions.setStageSize(0, 0);
    } else {
      SnapActions.setStageSize(480, 360);
    }

    this.fixLayout();

    return moreConvo;
};

FLECKSMorph.prototype.pressStartAgent = function () {
    console.log("In FLECKSMorph.prototype.pressStartAgent");
    var myself = this,
        world = this.world(),
        ide = this.ide();

    var moreConvo = false;

    moreConvo = toggleAgentImage(convoNum);
    if (moreConvo) {
      window.setTimeout(function(){myself.pressStartAgent()},3000);
    } else {
      if (convoNum < 6) {
        convoNum++;
        window.setTimeout(function(){myself.pressStartAgent()}, 30000);
      }
    }
};

IDE_Morph.prototype.agentPanelTexture = this.agentTexture();
IDE_Morph.prototype.agentPanelTexture2 = this.agentTexture2();

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

IDE_Morph.prototype.agentTexture = function () {
    var pic = newCanvas(new Point(480, 360)), // bigger scales faster
        ctx = pic.getContext('2d'),
        i;

    var image = new Image();

    image.onload = function () {
      ctx.drawImage(image,0,0,480,360);
    };
    image.src="./images/Nml_VeyestoJ_Vopensmile_Vfistbump.jpg";

    return pic;
};

IDE_Morph.prototype.agentTexture2 = function () {
    var pic = newCanvas(new Point(480, 360)), // bigger scales faster
        ctx = pic.getContext('2d'),
        i;

    var image = new Image();

    image.onload = function () {
      ctx.drawImage(image,0,0,480,360);
    };
    image.src="./images/Nml_Veyestostudent_Vopensmile_Vintrobody.jpg";

    return pic;
};


IDE_Morph.prototype.createAgentPanel = function () {
  console.log("In IDE_Morph.prototype.createAgentPanel");

  if (this.agentPanel) {this.agentPanel.destroy(); }
  this.agentPanel = new FrameMorph();

  /*BlockMorph.prototype.agentVideo = document.createElement('video');
  BlockMorph.prototype.agentVideo.src = 'sampleVideo.m4v';
  BlockMorph.prototype.agentVideo.play();
  this.agentPanel.add(BlockMorph.prototype.agentVideo);
  this.add(this.agentPanel);*/


  console.log("this.agentPanelTexture");
  this.agentPanel.cachedTexture = this.agentPanelTexture;
  this.agentPanel.drawCachedTexture();
  window.setTimeout(this.add(this.agentPanel),1000);
  this.agentPanel.acceptsDrops = false;
  //this.agentPanel.contents.acceptsDrops = false;

  this.agentPanel.drawCachedTexture = function () {
      var context = this.image.getContext('2d');
      var width = this.cachedTexture.width,
          height = this.cachedTexture.height-100;

      window.setTimeout(context.drawImage(this.cachedTexture, 0, 0,
        width, height), 1000);
  };
}
