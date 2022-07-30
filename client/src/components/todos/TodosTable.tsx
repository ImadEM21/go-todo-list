import { useState } from 'react';
import { styled, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';
import TablePaginationActions from './TablePaginationActions';
import { ITodo } from '../../@types/todo';
import TodoCell from './TodoCell';
import { useTheme } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
    '& .MuiTablePagination-selectLabel': {
        margin: 0,
        color: theme.palette.text.secondary
    },
    '& 	.MuiTablePagination-displayedRows': {
        margin: 0
    }
}));

export interface ITodosTableProps {
    todos: ITodo[];
}

const TodosTable = ({ todos }: ITodosTableProps) => {
    const [total, setTotal] = useState(todos.length);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const theme = useTheme();

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <StyledPaper elevation={0}>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table
                    sx={{
                        minWidth: '100%'
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" size="medium" sx={{ color: theme.palette.text.secondary }}>
                                Terminée
                            </TableCell>
                            <TableCell align="center" size="medium" sx={{ color: theme.palette.text.secondary }}>
                                Nom de la tâche
                            </TableCell>
                            <TableCell align="center" size="medium" sx={{ color: theme.palette.text.secondary }}>
                                Date limite
                            </TableCell>
                            <TableCell align="center" size="medium" sx={{ color: theme.palette.text.secondary }}>
                                Statut
                            </TableCell>
                            <TableCell align="center" size="medium" sx={{ color: theme.palette.text.secondary }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todos.map((todo) => (
                            <TodoCell key={todo._id} todo={todo} />
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count !== -1 ? count : `plus que ${to}`}`}
                                labelRowsPerPage="Lignes par page"
                                colSpan={3}
                                count={total}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'Lignes par page'
                                    },
                                    native: true
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </StyledPaper>
    );
};

export default TodosTable;
