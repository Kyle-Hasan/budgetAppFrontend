import { transaction } from "@/components/transactions/transactionItemChild";
import React, { ReactNode, useState } from "react";
import { budgetForm } from "../../components/budgets/CreateBudgetForm";
import { accountForm } from "@/components/accounts/AccountForm";

type FormContextType = {
    transactionForm: transaction | null;
    budgetForm: budgetForm | null;
    setTransactionForm: (form: transaction | null) => void;
    setBudgetForm: (form: budgetForm | null) => void;
    accountForm: accountForm | null;
    setAccountForm: (form: accountForm | null) => void;
    refreshBudgetSummary: Function | null;
    setRefreshBudgetSummary: (fn: Function) => void;
    refreshAccountSummary: Function | null;
    setRefreshAccountSummary: (fn: Function) => void;
    refreshTransactionSummary: Function | null;
    setRefreshTransactionSummary: (fn: Function) => void;
} | null;

const FormContext = React.createContext<FormContextType>(null);

const FormProvider = ({ children }: { children: ReactNode }) => {
    const [transactionForm, setTransactionForm] = useState<transaction | null>(null);
    const [budgetForm, setBudgetForm] = useState<budgetForm | null>(null);
    const [accountForm, setAccountForm] = useState<accountForm | null>(null);
    const [refreshBudgetSummary, setRefreshBudgetSummary] = useState<Function | null>(null);
    const [refreshAccountSummary,setRefreshAccountSummary] = useState<Function | null>(null)
    const [refreshTransactionSummary,setRefreshTransactionSummary] = useState<Function | null>(null)

    return (
        <FormContext.Provider 
            value={{
                transactionForm,
                setTransactionForm,
                budgetForm,
                setBudgetForm,
                accountForm,
                setAccountForm,
                refreshBudgetSummary,
                setRefreshBudgetSummary,
                refreshAccountSummary,
                setRefreshAccountSummary,
                refreshTransactionSummary,
                setRefreshTransactionSummary
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

export { FormProvider, FormContext };
