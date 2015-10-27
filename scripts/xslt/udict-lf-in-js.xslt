<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:f="myfunctions">
<xsl:output method="text" encoding="utf-8" />
      <xsl:include href="inc-file2uri.xslt"/>
      <xsl:param name="sourcetextfile"/>
      <xsl:variable name="sourcetext" select="unparsed-text(f:file2uri($sourcetextfile))"/>
      <xsl:template match="/">
<xsl:value-of select="replace($sourcetext,'\n\s+&lt;','&lt;')"/>
 </xsl:template>
</xsl:stylesheet>
