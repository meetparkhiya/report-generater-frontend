import {
    Box,
    Card,
    TextField,
    InputAdornment,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Inventory', value: 'Inventory' },
    { label: 'Financial', value: 'Financial' },
    { label: 'Analytics', value: 'Analytics' },
    { label: 'Custom', value: 'Custom' },
];

const ReportFilters = ({
    searchQuery,
    onSearchChange,
    activeFilter,
    onFilterChange,
}) => {
    const handleFilterChange = (
        _event,
        newFilter
    ) => {
        if (newFilter !== null) {
            onFilterChange(newFilter);
        }
    };

    return (
        <Card sx={{ p: 2.5 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <TextField
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    size="small"
                    sx={{ maxWidth: { sm: 350 }, flexGrow: { xs: 1, sm: 0 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflowX: 'auto' }}>
                    <FilterList color="action" sx={{ flexShrink: 0 }} />
                    <ToggleButtonGroup
                        value={activeFilter}
                        exclusive
                        onChange={handleFilterChange}
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                px: 2,
                                py: 0.75,
                                borderRadius: '8px !important',
                                border: '1px solid transparent',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                },
                            },
                        }}
                    >
                        {filterOptions.map((option) => (
                            <ToggleButton key={option.value} value={option.value}>
                                {option.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box> */}
            </Box>
        </Card>
    );
};

export default ReportFilters;
