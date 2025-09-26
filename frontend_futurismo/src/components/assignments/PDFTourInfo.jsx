import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../../styles/pdfStyles';

const PDFTourInfo = ({ tourData, t }) => {
  const { 
    tourDate, 
    tourTime, 
    tourName, 
    groupSize, 
    agency, 
    guide,
    driver,
    vehicle,
    pickup,
    language 
  } = tourData;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('pdf.tourInformation')}</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.date')}:</Text>
            <Text style={styles.infoValue}>{tourDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.time')}:</Text>
            <Text style={styles.infoValue}>{tourTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.tour')}:</Text>
            <Text style={styles.infoValue}>{tourName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.groupSize')}:</Text>
            <Text style={styles.infoValue}>{groupSize} {t('pdf.people')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.language')}:</Text>
            <Text style={styles.infoValue}>{language || t('pdf.spanish')}</Text>
          </View>
        </View>
        
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.agency')}:</Text>
            <Text style={styles.infoValue}>{agency?.name || t('pdf.notAssigned')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.contact')}:</Text>
            <Text style={styles.infoValue}>{agency?.contact || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.guide')}:</Text>
            <Text style={styles.infoValue}>{guide?.name || t('pdf.notAssigned')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.driver')}:</Text>
            <Text style={styles.infoValue}>{driver?.name || t('pdf.notAssigned')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.vehicle')}:</Text>
            <Text style={styles.infoValue}>{vehicle?.plateNumber || t('pdf.notAssigned')}</Text>
          </View>
        </View>
      </View>
      
      {pickup && (
        <View style={[styles.infoBox, { marginTop: 8 }]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.pickupPoint')}:</Text>
            <Text style={styles.infoValue}>{pickup.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('pdf.pickupTime')}:</Text>
            <Text style={styles.infoValue}>{pickup.time}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

PDFTourInfo.propTypes = {
  tourData: PropTypes.shape({
    tourDate: PropTypes.string.isRequired,
    tourTime: PropTypes.string.isRequired,
    tourName: PropTypes.string.isRequired,
    groupSize: PropTypes.number.isRequired,
    agency: PropTypes.object,
    guide: PropTypes.object,
    driver: PropTypes.object,
    vehicle: PropTypes.object,
    pickup: PropTypes.object,
    language: PropTypes.string
  }).isRequired,
  t: PropTypes.func.isRequired
};

export default PDFTourInfo;