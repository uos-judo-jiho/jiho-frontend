import { ReactComponent as Plus } from "../../../assets/svgs/plus.svg";

import { Button, DatePicker, Form, Input, Space, Upload } from "antd";
import { RcFile } from "antd/es/upload/interface";
import axios from "axios";
import { useState } from "react";
import { Constants } from "../../../constant/constant";
import { formatDateTime } from "../../../utils/Utils";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

function TrainingLogForm() {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const meta: { [key: string]: string } = {
    title: "title 1",
    contents: "contents 1",
  };

  function onFinish(values: any) {
    console.log("Success:", values);
    console.log(
      "dateTime string:",
      formatDateTime(new Date(values.dateTime.$d).toLocaleDateString()),
      typeof new Date(values.dateTime.$d).toLocaleDateString()
    );
  }

  function handleUpload() {
    console.log(fileList);

    axios.post(Constants.BASE_URL + "api/login", fileList, {});
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
        <Form.List name="tags">
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
                    name={[name, "name"]}
                    rules={[{ required: true, message: "이름을 적으세요" }]}
                  >
                    <Input placeholder="참여자 이름" />
                  </Form.Item>

                  <Button onClick={() => remove(name)}>제거하기</Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  참여자 추가하기
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item label="운동 날짜" name="dateTime">
          <DatePicker />
        </Form.Item>

        <Form.Item label="훈련 일지 본문" name="description">
          <TextArea rows={8} />
        </Form.Item>

        {/* TODO 사진 올리기 구현하기 */}
        <Form.Item label="사진 올리기" valuePropName="fileList">
          <Upload
            name="files"
            listType="picture-card"
            action={Constants.BASE_URL + "api/login"}
            beforeUpload={(file) => {
              setFileList((prev) => {
                return [...prev, file];
              });
              return false; // 파일 선택시 바로 업로드 하지 않고 후에 한꺼번에 전송하기 위함
            }}
          >
            <div>
              <Plus />
              <div>사진 올리기</div>
            </div>
          </Upload>
        </Form.Item>

        <Button block type="primary" htmlType="submit" onClick={handleUpload}>
          제출하기
        </Button>
      </Form>
    </>
  );
}

export default TrainingLogForm;
