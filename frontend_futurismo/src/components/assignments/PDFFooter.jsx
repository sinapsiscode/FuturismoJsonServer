import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react/pdf/renderer';
import { pdfStyles as styles } from '../../styles/pdfStyles';

const PDFFooter = ({ t }) => {
  const currentDate = new Date().toLocaleDateString('es-ES');
  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <View style={styles.footer}>
      <View style={styles.footerGrid}>
        <View style={styles.footerBox}>
          <Text style={styles.footerTitle}>{t('pdf.officeContact')}</Text>
          <Text style={styles.footerText}>{t('pdf.phone')}: +351 123 456 789</Text>
          <Text style={styles.footerText}>{t('pdf.email')}: info@futurismo.com</Text>
          <Text style={styles.footerText}>{t('pdf.address')}: Azores, Portugal</Text>
        </View>
        
        <View style={styles.footerBox}>
          <Text style={styles.footerTitle}>{t('pdf.emergencyNumbers')}</Text>
          <Text style={styles.footerText}>{t('pdf.emergency')}: 112</Text>
          <Text style={styles.footerText}>{t('pdf.officeEmergency')}: +351 999 888 777</Text>
          <Text style={styles.footerText}>{t('pdf.coordinator')}: +351 999 666 555</Text>
        </View>
        
        <View style={styles.footerBox}>
          <Text style={styles.footerTitle}>{t('pdf.documentInfo')}</Text>
          <Text style={styles.footerText}>{t('pdf.generatedOn')}: {currentDate}</Text>
          <Text style={styles.footerText}>{t('pdf.time')}: {currentTime}</Text>
          <Text style={styles.footerText}>{t('pdf.validFor')}: {currentDate}</Text>
        </View>
      </View>
      
      <View style={styles.footerBottom}>
        <Text style={styles.footerBottomText}>
          {t('pdf.confidentialDocument')}
        </Text>
        <Text style={styles.footerBottomText}>
          FUTURISMO - {t('pdf.allRightsReserved')} © {new Date().getFullYear()}
        </Text>
      </View>
    </View>
  );
};

PDFFooter.propTypes = {
  t: PropTypes.func.isRequired
};

export default PDFFooter;