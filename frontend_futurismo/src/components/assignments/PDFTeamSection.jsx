import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../../styles/pdfStyles';

const PDFTeamSection = ({ guide, driver, t }) => {
  if (!guide && !driver) return null;

  return (
    <View style={styles.teamSection}>
      <Text style={styles.teamTitle}>{t('pdf.assignedTeam')}</Text>
      
      {guide && (
        <View style={styles.teamMember}>
          <Text style={styles.teamMemberName}>
            {guide.name} - {t('pdf.tourGuide')}
          </Text>
          <Text style={styles.teamMemberInfo}>
            {t('pdf.phone')}: {guide.phone || t('pdf.notAvailable')}
          </Text>
          <Text style={styles.teamMemberInfo}>
            {t('pdf.languages')}: {guide.languages?.join(', ') || t('pdf.spanish')}
          </Text>
          {guide.specialties && (
            <Text style={styles.teamMemberInfo}>
              {t('pdf.specialties')}: {guide.specialties.join(', ')}
            </Text>
          )}
        </View>
      )}
      
      {driver && (
        <View style={styles.teamMember}>
          <Text style={styles.teamMemberName}>
            {driver.name} - {t('pdf.driver')}
          </Text>
          <Text style={styles.teamMemberInfo}>
            {t('pdf.phone')}: {driver.phone || t('pdf.notAvailable')}
          </Text>
          <Text style={styles.teamMemberInfo}>
            {t('pdf.licenseType')}: {driver.licenseType || '-'}
          </Text>
          {driver.vehicleType && (
            <Text style={styles.teamMemberInfo}>
              {t('pdf.vehicleType')}: {driver.vehicleType}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

PDFTeamSection.propTypes = {
  guide: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    specialties: PropTypes.arrayOf(PropTypes.string)
  }),
  driver: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    licenseType: PropTypes.string,
    vehicleType: PropTypes.string
  }),
  t: PropTypes.func.isRequired
};

export default PDFTeamSection;