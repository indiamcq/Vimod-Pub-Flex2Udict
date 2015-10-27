<xsl:stylesheet version="2.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:silp="silp.org.ph/ns" exclude-result-prefixes="xs silp">
      <xsl:template match="link">
            <xsl:variable name="len" select="string-length(.)"/>
            <xsl:variable name="sense" select="substring(.,$len,1)"/>
            <xsl:choose>
                  <xsl:when test="ancestor::lxGroup/lx = .">
                        <xsl:apply-templates/>
                  </xsl:when>
                  <xsl:otherwise>
                        <xsl:element name="a">
                              <xsl:attribute name="onclick">
                                    <xsl:text>selectByIndex(</xsl:text>
                                    <xsl:value-of select="@data"/>
                                    <xsl:text>, 2)</xsl:text>
                                    <xsl:choose>
                                          <xsl:when test="parent::rt">
                                                <xsl:text>#table</xsl:text>
                                          </xsl:when>
                                          <xsl:otherwise>
                                                <xsl:if test="matches(following-sibling::sense[1],'\d$')">
                                                      <xsl:text>#sense</xsl:text>
                                                      <xsl:value-of select="following-sibling::sense[1]"/>
                                                </xsl:if>
                                          </xsl:otherwise>
                                    </xsl:choose>
                              </xsl:attribute>
                              <xsl:attribute name="title">
                                    <xsl:value-of select="@title"/>
                              </xsl:attribute>
                              <xsl:call-template name="hom">
                                    <xsl:with-param name="string" select="."/>
                              </xsl:call-template>
                        </xsl:element>
                  </xsl:otherwise>
            </xsl:choose>
      </xsl:template>
      <xsl:template match="linkold">
            <xsl:variable name="len" select="string-length(.)"/>
            <xsl:variable name="sense" select="substring(.,$len,1)"/>
            <xsl:element name="a">
                  <xsl:attribute name="href">
                        <xsl:text>../lexicon/lx</xsl:text>
                        <xsl:value-of select="@data"/>
                        <xsl:text>.html</xsl:text>
                        <xsl:if test="matches(following-sibling::text()[1],'\s\d$') and string-length(following-sibling::text()[1]) = 2">
                              <xsl:text>#sense</xsl:text>
                              <xsl:value-of select="translate(following-sibling::text()[1],' ','')"/>
                        </xsl:if>
                  </xsl:attribute>
                  <xsl:if test="matches(following-sibling::text()[1],'\s\d$') and string-length(following-sibling::text()[1]) = 2">
                        <xsl:attribute name="class">
                              <xsl:text>senseafter</xsl:text>
                        </xsl:attribute>
                  </xsl:if>
                  <xsl:call-template name="hom">
                        <xsl:with-param name="string" select="."/>
                  </xsl:call-template>
            </xsl:element>
      </xsl:template>
</xsl:stylesheet>
