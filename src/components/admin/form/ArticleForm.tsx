import { DatePicker, Form, Input } from "antd";
import { RcFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../../utils/Utils";
import {
  ButtonContainer,
  FormContainer,
  InputContainer,
  StyledInput,
  StyledTextArea,
  TagAddButton,
  TagDeleteButton,
  TagsContainer,
} from "./StyledComponent/FormContainer";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

type ArticleFormProps = {
  apiUrl: string;
};

type ValuesType = {
  author: string;
  title: string;
  tags: string[];
  description: string;
  dateTime: string;
  images: RcFile[];
};

const initValues = {
  author: "",
  title: "",
  tags: [],
  description: "",
  dateTime: "",
  images: [],
};

function ArticleForm({ apiUrl }: ArticleFormProps) {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [values, setValues] = useState<ValuesType>(initValues);
  const [form] = Form.useForm();

  const meta: { [key: string]: string } = {
    title: "title 1",
    contents: "contents 1",
  };

  function onFinish(params: any) {
    const isFull = Object.values(params).every((element) => {
      return element !== undefined;
    });
    if (isFull) {
      setValues({
        ...values,
        author: params.author,
        title: params.title,
        tags: params.tags.map((x: any) => x.name),
        description: params.description,
        dateTime: formatDateTime(
          new Date(params.dateTime.$d).toLocaleDateString()
        ),
      });
      console.log(isFull);
    } else {
    }
  }

  function handleUpload() {
    setValues({ ...values, images: fileList });
  }

  useEffect(() => {
    console.log("useEffect");
    if (!Object.values(values).some((el) => el.length === 0)) {
      // TODO post api
      console.log("api call");
      console.log(values);
      form.resetFields();
      setValues(initValues);
      setFileList([]);
    }
  }, [values]);

  function handleSumbit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(values);
  }

  function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => {
      return { ...prev, author: event.target.value };
    });
  }
  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => {
      return { ...prev, title: event.target.value };
    });
  }

  function handleDescriptionChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setValues((prev) => {
      return { ...prev, description: event.target.value };
    });
  }
  function handleTagsChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    setValues((prev) => {
      let oldTags = [...prev.tags];
      oldTags[index] = event.target.value;
      return { ...prev, tags: oldTags };
    });
  }

  function handleAddTagsClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    setValues((prev) => {
      let newTags = [...prev.tags];
      newTags.push("");
      return { ...prev, tags: newTags };
    });
  }

  function handleDeleteTagClick(
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) {
    event.preventDefault();

    setValues((prev) => {
      let changedTags = [...prev.tags];

      if (index > -1) changedTags.splice(index, 1);

      return { ...prev, tags: changedTags };
    });
  }

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => {
      return { ...prev, dateTime: event.target.value };
    });
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSumbit}>
          <InputContainer>
            <label htmlFor="author">작성자</label>
            <StyledInput
              id="author"
              type="text"
              name="author"
              onChange={handleAuthorChange}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor="title">제목</label>
            <StyledInput
              id="title"
              type="text"
              name="title"
              onChange={handleTitleChange}
              required
            />
          </InputContainer>

          <InputContainer>
            <label htmlFor="tag">참여 인원</label>
            {values.tags.map((tag, index) => {
              return (
                <TagsContainer key={"tag" + index}>
                  <StyledInput
                    id="tag"
                    name="tag"
                    onChange={(event) => handleTagsChange(event, index)}
                    required
                  />
                  <TagDeleteButton
                    onClick={(event) => handleDeleteTagClick(event, index)}
                  >
                    삭제
                  </TagDeleteButton>
                </TagsContainer>
              );
            })}
            <TagAddButton onClick={handleAddTagsClick}>추가하기</TagAddButton>
          </InputContainer>
          {/* TODO 작성날짜 추가 */}
          <InputContainer>
            <label htmlFor="date">훈련날짜</label>
            <StyledInput
              id="date"
              type="date"
              name="date"
              onChange={handleDateChange}
              required
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor="description">본문</label>
            <StyledTextArea
              id="description"
              name="description"
              onChange={handleDescriptionChange}
              required
            />
          </InputContainer>
          {/* TODO 사진 올리기 */}
          <ButtonContainer>
            <StyledInput type="submit" />
          </ButtonContainer>
        </form>
      </FormContainer>
    </>
    // <>
    //   <Form
    //     form={form}
    //     labelCol={{ span: 4 }}
    //     wrapperCol={{ span: 14 }}
    //     layout="horizontal"
    //     disabled={false}
    //     style={{ maxWidth: 600 }}
    //     onFinish={onFinish}
    //   >
    //     <Form.Item
    //       label="작성자"
    //       name="author"
    //       rules={[{ required: true, message: "작성자를 적으세요" }]}
    //     >
    //       <Input />
    //     </Form.Item>
    //     <Form.Item
    //       label="제목"
    //       name="title"
    //       rules={[{ required: true, message: "제목을 적으세요" }]}
    //     >
    //       <Input />
    //     </Form.Item>
    //     <Form.List name="tags">
    //       {(fields, { add, remove }) => (
    //         <>
    //           {fields.map(({ key, name, ...restField }) => (
    //             <Space
    //               key={key}
    //               style={{ display: "flex", marginBottom: 8 }}
    //               align="baseline"
    //             >
    //               <Form.Item
    //                 {...restField}
    //                 name={[name, "name"]}
    //                 rules={[{ required: true, message: "태그를 적으세요" }]}
    //               >
    //                 <Input placeholder="태그" />
    //               </Form.Item>

    //               <Button onClick={() => remove(name)}>제거하기</Button>
    //             </Space>
    //           ))}
    //           <Form.Item>
    //             <Button type="dashed" onClick={() => add()} block>
    //               태그 추가하기
    //             </Button>
    //           </Form.Item>
    //         </>
    //       )}
    //     </Form.List>

    //     <Form.Item
    //       label="작성 날짜"
    //       name="dateTime"
    //       rules={[{ required: true, message: "날짜를 선택하세요" }]}
    //     >
    //       <DatePicker />
    //     </Form.Item>

    //     <Form.Item
    //       label="본문"
    //       name="description"
    //       rules={[{ required: true, message: "본문를 적으세요" }]}
    //     >
    //       <TextArea rows={8} />
    //     </Form.Item>

    //     <Form.Item label="사진 올리기" valuePropName="fileList">
    //       <Upload
    //         name="files"
    //         listType="picture-card"
    //         action={Constants.BASE_URL + apiUrl}
    //         beforeUpload={(file) => {
    //           setFileList((prev) => {
    //             return [...prev, file];
    //           });
    //           return false; // 파일 선택시 바로 업로드 하지 않고 후에 한꺼번에 전송하기 위함
    //         }}
    //       >
    //         <div>
    //           <Plus />
    //           <div>사진 올리기</div>
    //         </div>
    //       </Upload>
    //     </Form.Item>

    //     <Button block type="primary" htmlType="submit" onClick={handleUpload}>
    //       제출하기
    //     </Button>
    //   </Form>
    // </>
  );
}

export default ArticleForm;
