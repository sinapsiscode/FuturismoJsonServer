import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, className = '', variant = 'default' }) => {
  const { t } = useTranslation();

  // Mobile-first responsive classes
  const baseClasses = "w-full";
  const variantClasses = {
    default: "block",
    mobile: "block",
    compact: "hidden sm:block"
  };

  return (
    <form onSubmit={onSearch} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="relative w-full">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search.searchServices')}
          className="form-control"
          style={{ paddingLeft: '40px' }}
        />
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'mobile', 'compact'])
};

export default SearchBar;