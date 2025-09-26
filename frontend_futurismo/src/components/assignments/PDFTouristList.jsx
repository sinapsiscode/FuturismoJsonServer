import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as styles } from '../../styles/pdfStyles';

const PDFTouristList = ({ tourists = [], t }) => {
  if (!tourists || tourists.length === 0) return null;

  return (
    <View style={styles.touristTable}>
      <Text style={styles.sectionTitle}>{t('pdf.touristList')}</Text>
      
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t('pdf.name')}</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>{t('pdf.document')}</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>{t('pdf.phone')}</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t('pdf.age')}</Text>
      </View>
      
      {tourists.map((tourist, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>{tourist.name}</Text>
          <Text style={[styles.tableCell, { flex: 1.5 }]}>
            {tourist.documentType}: {tourist.documentNumber}
          </Text>
          <Text style={[styles.tableCell, { flex: 1.5 }]}>
            {tourist.phone || '-'}
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>
            {tourist.age || '-'}
          </Text>
        </View>
      ))}
      
      <View style={[styles.infoRow, { marginTop: 8, borderBottomWidth: 0 }]}>
        <Text style={styles.infoLabel}>{t('pdf.totalTourists')}:</Text>
        <Text style={styles.infoValue}>{tourists.length}</Text>
      </View>
    </View>
  );
};

PDFTouristList.propTypes = {
  tourists: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    documentType: PropTypes.string,
    documentNumber: PropTypes.string,
    phone: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })),
  t: PropTypes.func.isRequired
};

export default PDFTouristList;