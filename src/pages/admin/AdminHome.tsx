import FormContainer from "../../components/admin/FormContainer";
import TrainingLogForm from "../../components/admin/TrainingLogForm";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";

function AdminHome() {
  return (
    <DefaultLayout>
      <SheetWrapper>
        <FormContainer title="훈련일지 관리">
          <TrainingLogForm />
        </FormContainer>
      </SheetWrapper>
    </DefaultLayout>
  );
}

export default AdminHome;
