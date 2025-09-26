import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../../styles/pdfStyles';

const PDFNotesSection = ({ notes, emergencyInfo, t }) => {
  return (
    <>
      {notes && (
        <View style={styles.notesSection}>
          <View style={styles.notesTitle}>
            <Text>{t('pdf.importantNotes')}</Text>
          </View>
          <Text style={styles.notesText}>{notes}</Text>
        </View>
      )}
      
      <View style={styles.emergencySection}>
        <Text style={styles.emergencyTitle}>{t('pdf.emergencyProtocol')}</Text>
        <View style={styles.emergencyGrid}>
          <View style={styles.emergencyBox}>
            <Text style={styles.emergencyBoxTitle}>{t('pdf.inCaseOfEmergency')}</Text>
            <Text style={styles.emergencyContact}>1. {t('pdf.callEmergency')} 112</Text>
            <Text style={styles.emergencyContact}>2. {t('pdf.notifyOffice')}</Text>
            <Text style={styles.emergencyContact}>3. {t('pdf.assistTourists')}</Text>
            <Text style={styles.emergencyContact}>4. {t('pdf.documentIncident')}</Text>
          </View>
          
          <View style={styles.emergencyBox}>
            <Text style={styles.emergencyBoxTitle}>{t('pdf.medicalCenters')}</Text>
            {emergencyInfo?.medicalCenters?.map((center, index) => (
              <Text key={index} style={styles.emergencyContact}>
                {center.name}: {center.phone}
              </Text>
            )) || (
              <>
                <Text style={styles.emergencyContact}>Hospital Divino: +351 296 203 000</Text>
                <Text style={styles.emergencyContact}>Centro Saúde: +351 296 204 100</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

PDFNotesSection.propTypes = {
  notes: PropTypes.string,
  emergencyInfo: PropTypes.shape({
    medicalCenters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string
    }))
  }),
  t: PropTypes.func.isRequired
};

export default PDFNotesSection;