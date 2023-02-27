import { ReactComponent as Plus } from "../../../assets/svgs/plus.svg";

import { Button, DatePicker, Form, Input, Space, Upload } from "antd";

const { TextArea } = Input;

function NewsForm() {
  function onFinish(values: any) {
    console.log("Success:", values);
  }
  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={false}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
      >
        <Form.Item label="작성자" name="author">
          <Input />
        </Form.Item>
        <Form.Item label="제목" name="title">
          <Input />
        </Form.Item>
        <Form.List name="subTitle">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "subTitle"]}
                    rules={[{ required: true, message: "태그를 적으세요" }]}
                  >
                    <Input placeholder="태그" />
                  </Form.Item>

                  <Button onClick={() => remove(name)}>제거하기</Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  태그 추가하기
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item label="작성 날짜" name="dateTime">
          <DatePicker />
        </Form.Item>

        <Form.Item label="본문" name="description">
          <TextArea rows={8} />
        </Form.Item>

        {/* TODO 사진 올리기 구현하기 */}
        <Form.Item label="사진 올리기" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <Plus />
              <div>사진 올리기</div>
            </div>
          </Upload>
        </Form.Item>

        <Button block type="primary" htmlType="submit">
          제출하기
        </Button>
      </Form>
    </>
  );
}

export default NewsForm;
