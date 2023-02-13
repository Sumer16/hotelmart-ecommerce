const classes = {
  main: {
    marginTop: 2,
    minHeight: '80vh',
  },
  sectionFlex: {
    marginTop: '1rem',
    marginBottom: '1rem',
    display: 'flex',
  },
  searchSectionFlex: {
    marginTop: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    flexWrap: 'wrap'
  },
  section: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  footer: {
    marginTop: 3,
    marginBottom: 2,
    textAlign: 'center',
  },
  appbar: {
    backgroundColor: '#1c99d5',
    '& a': {
      color: '#ffffff',
      marginLeft: 1,
    },
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  appBarButton: {
    marginRight: '6px',
    color:'#ffffff',
    textTransform: 'initial'
  },
  fullWidth: {
    width: '100%',
  },
  sort: {
    marginRight: 1,
  },
  // Search
  searchForm: {
    border: '1px solid #ffffff',
    backgroundColor: '#ffffff',
    borderRadius: 2,
    margin: 'auto',
    display: 'flex',
  },
  searchInput: {
    paddingLeft: 2,
    color: '#000000',
    '& ::placeholder': {
      color: '#606060',
    },
  },
  searchButton: {
    backgroundColor: '#f8c040',
    padding: 1,
    borderRadius: '0 5px 5px 0',
    '& span': {
      color: '#000000',
    },
    '& :hover': {
      color: '#e8ac23'
    },
  },
  gridAppBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 1,
    gridAutoFlow: 'row',
    gridTemplateAreas:
    `"brand search icons"`,
  },
  gridAppBarMobile: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 1,
    gridTemplateRows: 'auto',
    gridAutoFlow: 'row',
    gridTemplateAreas:
    `"brand icons icons"
    "search search search"`,
  }
}

export default classes;
