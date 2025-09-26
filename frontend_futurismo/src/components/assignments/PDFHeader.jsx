import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../../styles/pdfStyles';

const PDFHeader = ({ tourName, tourDate, tourTime, t }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.companyName}>FUTURISMO</Text>
        <Text style={styles.subtitle}>{t('pdf.tourOperator')}</Text>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>{t('pdf.assignmentBrochure')}</Text>
          <Text style={styles.titleSubtext}>
            {tourName} - {tourDate} {tourTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

PDFHeader.propTypes = {
  tourName: PropTypes.string.isRequired,
  tourDate: PropTypes.string.isRequired,
  tourTime: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

export default PDFHeader;