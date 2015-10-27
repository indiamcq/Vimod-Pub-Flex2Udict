# Vimod-Pub-Flex2Udict
Create Cordova hybrid dictionary apps from Flex data.

## Installation (Windows only)

Download the *Download ZIP* from [https://github.com/indiamcq/Vimod-Pub-Flex2Udict](https://github.com/indiamcq/Vimod-Pub-Flex2Udict) Unzip and place in a folder of your choosing. Just make sure it is a writable folder.

## Prerequisites 

* Node JS
* Cordova install with `npm install -g cordova`
* JDK 1.7 Java Developemant Kit JDK 1.8 may work but did no used to work with Android SDK
* Android SDK (smaller) or ADT bundle (bigger)

## Overview

This process is built on the Vimod-Pub platform.

[Flex](http://fieldworks.sil.org/) can output several XML compatible forms:

* LIFT Lexical Interchange Format
* XHTML

This approach makes use of the LIFT file and converts it to a [Toolbox](http://www.sil.org/computing/toolbox) compatible XML file. This is a much simplier format to deal with than LIFT. That is then converted to HTML and then embedded into a Javascript file. Other supporting files are also created. The resulting HTML, CSS and Javascript are then used as the seed for the Cordova cross platform app creation.

While the XHTML output could be used, it is designed for print not for digital output so lacks some features.

Ant tasks are used to build the Android output. As yet no other outputs have been added.

## Changes to be made

* The number of handleded languages needs to be increased from two to at least four. This also needs a UI update.
* Review the Flex to HTML options:
    * Improve LIFT to Toolbox XML conversion (this is the least work option as all is available even if incomplete handling)
    * or experiment with LIFT to HTML conversion and CSS to go with it.
    * or use the XTHML output from Flex (modified if needed) (Possibly the second easiest option)
* Get it all working.
* Add other platform outputs
* ???