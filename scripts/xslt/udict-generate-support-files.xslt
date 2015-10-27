<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
      <xsl:param name="buildsystem"/>
      <xsl:variable name="html5doctype" select="&lt;!DOCTYPE html&gt;"/>
      <xsl:variable name="index-html">
            <xsl:value-of select="$html5doctype"/>
            <html xmlns="http://www.w3.org/1999/xhtml">
                  <head>
                        <title><xsl:value-of select="$title"/></title>
                        <script src="scripts/jquery-1.8.2.min.js"></script>
                        <script src="scripts/jquery.mobile-1.3.0.min.js"></script>
                        <script>
		//The purpose of this page is only because Phone Gap doesn't like pages that take too long to load.
		//So this page loads quickly and then redirects to the actual page
		$(document).ready(function () {
			window.location.href = 'main.html';
		});
	</script>
                  </head>
                  <body/>
            </html>
      </xsl:variable>
      <xsl:variable name="main-html">
            <xsl:value-of select="$html5doctype"/>
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
                  <head>
                        <meta charset="utf-8"/>
                        <meta name="viewport" content="width=device-width, user-scalable=no"/>
                        <title><xsl:value-of select="$title"/></title>
                        <link href="css/jquery.mobile-1.3.0.min.css" rel="stylesheet"/>
                        <link href="css/jquery.mobile-1.0.1.transitions.css" rel="stylesheet"/>
                        <link href="css/labels.css" rel="stylesheet"/>
                        <link href="css/silpdict.css" rel="stylesheet"/>
                        <link href="css/style.css" rel="stylesheet"/>
                  </head>
                  <body style="display: none">
                        <div data-role="page" id="pgBrowse">
                              <div data-role="header" data-position="fixed" data-tap-toggle="false">
                                    <div class="header"><a data-role="button" data-theme="a" data-icon="grid" class="ui-icon-nodisc" style="margin: 0px 10px 3px 0px;" data-inline="true" data-iconshadow="false" data-iconpos="notext"></a><span class="language"></span>-English Dictionary</div>
                              </div>
                              <div id="divBrowse" data-role="content">
                                    <ul id="lsBrowse" data-role="listview" data-theme="d">
			</ul>
                              </div>
                              <div data-role="footer" data-position="fixed" data-tap-toggle="false">
                                    <div data-role="navbar" data-iconpos="top">
                                          <ul>
                                                <li>
                                                      <a data-icon="search" id="showLangSearchBrowse" onclick="changeSearchType(LANGUAGE_OPT.Language)">
                                                            <span class="language">
                                                                  <xsl:value-of select="$langname"/>
                                                            </span>
                                                      </a>
                                                </li>
                                                <li>
                                                      <a data-icon="search" id="showEnglishSearchBrowse" onclick="changeSearchType(LANGUAGE_OPT.English)">English</a>
                                                </li>
                                                <li>
                                                      <a data-role="button" data-theme="a" data-icon="grid" class="menuSelection browse" onclick="showBrowse(false)">Browse</a>
                                                </li>
                                                <li>
                                                      <a data-role="button" id="A3" data-theme="a" data-icon="back" class="no-select" onclick="searchBack()">Back</a>
                                                </li>
                                          </ul>
                                    </div>
                              </div>
                        </div>
                        <div data-role="page" id="pgSearch">
                              <div data-role="header" data-position="fixed" data-tap-toggle="false">
                                    <input type="search" name="search-mini" id="search-mini" value="" data-mini="true" data-theme="a"/>
                              </div>
                              <div id="divSearchContent" data-role="content">
                                    <ul id="lsWords" data-role="listview" data-theme="d">
			</ul>
                              </div>
                              <div data-role="footer" data-position="fixed" data-tap-toggle="false">
                                    <div data-role="navbar" data-iconpos="top">
                                          <ul>
                                                <li>
                                                      <a data-icon="search" id="langLanguage" class="menuSelection languageOptLanguage" onclick="changeSearchType(LANGUAGE_OPT.Language)">
                                                            <span class="language"></span>
                                                      </a>
                                                </li>
                                                <li>
                                                      <a data-icon="search" id="langEnglish" class="menuSelection languageOptEnglish" onclick="changeSearchType(LANGUAGE_OPT.English)">English</a>
                                                </li>
                                                <li>
                                                      <a data-role="button" data-theme="a" data-icon="grid" onclick="showBrowse(false)">Browse</a>
                                                </li>
                                                <li>
                                                      <a data-role="button" id="btnSearchBack" data-theme="a" data-icon="back" class="no-select" onclick="searchBack()">Back</a>
                                                </li>
                                          </ul>
                                    </div>
                              </div>
                        </div>
                        <div data-role="page" id="pgDisplayWord">
                              <div data-role="header" data-position="fixed" data-tap-toggle="false">
                                    <a id="btnPrev" href="#" class="prev ui-icon-nodisc" data-role="button" data-icon="arrow-l" data-iconshadow="false" data-iconpos="notext" data-theme="a">Previous</a>
                                    <div class="header">
                                          <a id="icMode" data-role="button" data-theme="a" data-icon="grid" class="ui-icon-nodisc" style="margin: 0px 10px 3px 0px;" data-inline="true" data-iconshadow="false" data-iconpos="notext"></a>
                                          <span id="headingTtl" class="dispHeading"></span>
                                          <span class="right">
                                                <span id="headingI" class="dispHeading"></span>
                                                <span id="headingCount" class="dispHeading"></span>
                                          </span>
                                    </div>
                                    <a id="btnNext" href="#" class="next ui-icon-nodisc" data-role="button" data-icon="arrow-r" data-iconshadow="false" data-iconpos="notext" data-theme="a">Next</a>
                              </div>
                              <div id="divWordContent" data-role="content">
		</div>
                              <div data-role="footer" data-position="fixed" data-tap-toggle="false">
                                    <div data-role="navbar" data-iconpos="top">
                                          <ul>
                                                <li>
                                                      <a data-icon="search" id="showLangSearchDisp" onclick="changeSearchType(LANGUAGE_OPT.Language)">
                                                            <span class="language"></span>
                                                      </a>
                                                </li>
                                                <li>
                                                      <a data-icon="search" id="showEngSearchDisp" onclick="changeSearchType(LANGUAGE_OPT.English)">English</a>
                                                </li>
                                                <li>
                                                      <a data-role="button" data-theme="a" data-icon="grid" onclick="showBrowse(false)">Browse</a>
                                                </li>
                                                <li>
                                                      <a id="btnBack" data-role="button" data-theme="a" data-icon="back" class="no-select" onclick="wordBack()">Back</a>
                                                </li>
                                          </ul>
                                    </div>
                              </div>
                        </div>
                        <script src="scripts/json2.js"></script>
                        <script src={$buildsystem}.js"></script>
                        <script src="scripts/jquery-1.8.2.min.js"></script>
                        <script src="scripts/jquery.mobile-1.3.0.min.js"></script>
                        <script src="scripts/lang.js"></script>
                        <script src="scripts/dictionary.js"></script>
                        <script src="scripts/data.js"></script>
                  </body>
            </html>
      </xsl:variable>
      <xsl:template match="/">

 </xsl:template>
</xsl:stylesheet>
