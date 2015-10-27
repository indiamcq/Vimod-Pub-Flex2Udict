<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
   <xsl:variable name="projectpath"
                 select="'C:\vimod-spinoff-project\vimod-pub-flex-u-dict\data\xxx'"/>
   <xsl:variable name="cd" select="'C:\vimod-spinoff-project\vimod-pub-flex-u-dict'"/>
   <xsl:variable name="true" select="tokenize('true yes on 1','\s+')"/>
   <xsl:variable name="comment1" select="'# project.tasks'"/>
   <xsl:variable name="comment2"
                 select="'#run your first task           ;command echo &#34;Hello World!&#34;'"/>
   <xsl:variable name="comment3">iso                                     </xsl:variable>
   <xsl:param name="iso" select="'xxx'"/>
   <xsl:variable name="comment4">pcode                                   </xsl:variable>
   <xsl:param name="pcode" select="concat($iso,'-dict')"/>
   <xsl:variable name="comment5"
                 select="'#in put                                  ;var confdict &#34;%projectpath%\ifk-conf-dict.xhtml&#34;'"/>
   <xsl:variable name="comment6">language                                </xsl:variable>
   <xsl:param name="langname" select="'Language'"/>
   <xsl:variable name="comment7">set voltitle                            </xsl:variable>
   <xsl:param name="title" select="'Language-English Dictionary'"/>
   <xsl:variable name="comment8">set voltitle                            </xsl:variable>
   <xsl:param name="voltitle" select="concat($title,'')"/>
   <xsl:variable name="comment9">app title                               </xsl:variable>
   <xsl:param name="app_name" select="'Language Dictionary'"/>
   <xsl:variable name="comment10"
                 select="'# alt copyright                         ;var altcopyright &#34;&#34;'"/>
   <xsl:variable name="comment11">reverseurl                              </xsl:variable>
   <xsl:param name="revurl" select="concat('org.sil.dict.',$iso)"/>
   <xsl:variable name="comment12">letters                                 </xsl:variable>
   <xsl:param name="vern-letters_list"
              select="'a b c d e f g h i j k l m n o p q r s t u v w x y z '"/>
   <xsl:variable name="vern-letters" select="tokenize($vern-letters_list,'\s+')"/>
   <xsl:variable name="comment14">publication date                        </xsl:variable>
   <xsl:param name="pubdate" select="'2015'"/>
   <xsl:variable name="comment15">second language                         </xsl:variable>
   <xsl:param name="iso2" select="'eng'"/>
   <xsl:variable name="comment16">third language                          </xsl:variable>
   <xsl:param name="iso3" select="'tgl'"/>
   <xsl:variable name="comment17">third language                          </xsl:variable>
   <xsl:param name="iso4" select="''"/>
   <xsl:variable name="comment18">sourcefile                              </xsl:variable>
   <xsl:param name="liftfile" select="concat($projectpath,'\',$iso,'.lift')"/>
   <xsl:variable name="comment19">mdf xml file                            </xsl:variable>
   <xsl:param name="xmlfile" select="concat($projectpath,'\',$iso,'.xml')"/>
   <xsl:variable name="comment20">vernacular                              </xsl:variable>
   <xsl:param name="vernacular" select="concat($iso,'')"/>
   <xsl:variable name="comment21">nationl lang code                       </xsl:variable>
   <xsl:param name="national" select="'tl'"/>
   <xsl:variable name="comment22">regional lang code                      </xsl:variable>
   <xsl:param name="regional" select="''"/>
   <xsl:variable name="comment23">regional2 lang code                     </xsl:variable>
   <xsl:param name="regional2" select="''"/>
   <xsl:variable name="comment24">regional3 lang code                     </xsl:variable>
   <xsl:param name="regional3" select="''"/>
   <xsl:variable name="comment25" select="'# groupings for html generation'"/>
   <xsl:variable name="comment26">                                        </xsl:variable>
   <xsl:param name="prefile" select="'/lexicon/lx'"/>
   <xsl:variable name="comment27">                                        </xsl:variable>
   <xsl:param name="preurl" select="'../lexicon/lx'"/>
   <xsl:variable name="comment28">                                        </xsl:variable>
   <xsl:param name="groupsdivstext"
              select="'psGroup glGroup snGroup vaGroup exGroup iiGroup itGroup ivGroup lsGroup liGroup lcGroup msGroup odeGroup oidGroup oseGroup raGroup rtGroup reGroup rfGroup rgGroup rsGroup scGroup ocGroup'"/>
   <xsl:variable name="comment29">                                        </xsl:variable>
   <xsl:param name="inlinespanstext"
              select="'charbold charitalic charbolditalic strong oi em op rf ad'"/>
   <xsl:variable name="comment30">                                        </xsl:variable>
   <xsl:param name="sensehomtext" select="'ra re rg rs rt'"/>
   <xsl:variable name="comment31">                                        </xsl:variable>
   <xsl:param name="groupedsensehomlist" select="'ra re rg rs rt'"/>
   <xsl:variable name="comment32">                                        </xsl:variable>
   <xsl:param name="omittext" select="'no ie'"/>
   <xsl:variable name="comment33">                                        </xsl:variable>
   <xsl:param name="omitfields-html_list" select="'no'"/>
   <xsl:variable name="omitfields-html" select="tokenize($omitfields-html_list,'\s+')"/>
   <xsl:variable name="comment34">                                        </xsl:variable>
   <xsl:param name="omitfields-js_list" select="'ie'"/>
   <xsl:variable name="omitfields-js" select="tokenize($omitfields-js_list,'\s+')"/>
   <xsl:variable name="comment35">                                        </xsl:variable>
   <xsl:param name="translateabreviations" select="'ps oc'"/>
   <xsl:variable name="comment36">                                        </xsl:variable>
   <xsl:param name="abreviationsinlinelist" select="'oc'"/>
   <xsl:variable name="comment37">                                        </xsl:variable>
   <xsl:param name="serialnodesnothom" select="'ii iv it'"/>
   <xsl:variable name="comment38">                                        </xsl:variable>
   <xsl:param name="spacebeforehom" select="'no'"/>
   <xsl:variable name="comment39" select="'# the following rarely need editing'"/>
   <xsl:variable name="comment40">build folder                            </xsl:variable>
   <xsl:param name="buildsystem" select="'cordova'"/>
   <xsl:variable name="comment41">remove space                            </xsl:variable>
   <xsl:param name="appname0" select="replace($title,' ','')"/>
   <xsl:variable name="comment42">remove hyphen                           </xsl:variable>
   <xsl:param name="appname" select="replace($appname0,'-','')"/>
   <xsl:variable name="comment43">keystore to use                         </xsl:variable>
   <xsl:param name="keystore" select="'dict.key'"/>
   <xsl:variable name="comment44">key alias                               </xsl:variable>
   <xsl:param name="keyalias" select="'dict'"/>
   <xsl:variable name="comment46" select="'# the following do not need changing'"/>
   <xsl:variable name="comment47">default path for key store              </xsl:variable>
   <xsl:param name="defaultkeystorepath" select="concat($cd,'\Android-keystore')"/>
   <xsl:variable name="comment48">keystore                                </xsl:variable>
   <xsl:param name="keystorefile" select="concat($defaultkeystorepath,'\',$keystore)"/>
   <xsl:variable name="comment49">set build path                          </xsl:variable>
   <xsl:param name="buildpath" select="concat($projectpath,'\',$buildsystem,'\www')"/>
   <xsl:variable name="comment50">android build path                      </xsl:variable>
   <xsl:param name="androidantbuildpath"
              select="concat($projectpath,'\',$buildsystem,'\platforms\android')"/>
   <xsl:variable name="comment51">ant propertis file                      </xsl:variable>
   <xsl:param name="antproperties"
              select="concat($androidantbuildpath,'\ant.properties')"/>
   <xsl:variable name="comment52" select="'# u-dict '"/>
   <xsl:variable name="comment53">icons                                   </xsl:variable>
   <xsl:param name="iconresourcepath" select="'resources\icons\dictionary'"/>
   <xsl:variable name="comment54">filename                                </xsl:variable>
   <xsl:param name="iconrespartname" select="'Dictionary-icon'"/>
   <xsl:variable name="comment55">app icon name                           </xsl:variable>
   <xsl:param name="appicon" select="'dict'"/>
   <xsl:variable name="comment56"
                 select="'get passwords                           ;tasklist passwords.tasks'"/><!-- get passwords                           ;tasklist passwords.tasks get passwords                           ;tasklist passwords.tasks not found --><xsl:variable name="comment57"
                 select="'make xslt                               ;projectxslt'"/>
</xsl:stylesheet>
