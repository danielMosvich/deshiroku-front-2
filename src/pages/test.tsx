import { useState } from "react";
import ModalContainer from "../components/global-react/modalContainer";
import MyButton from "../components/global-react/myButton";
import Tabs from "../components/global-react/tabs";

function Test() {
  const [isOpen, setIsOpen] = useState(false);
  const tabs = [
    { label: "Tab 1", content: <div>Content for Tab 1</div> },
    { label: "Tab 2", content: <div>Content for Tab 2</div> },
    { label: "Tab 3", content: <div>Content for Tab 3</div> },
  ];
  return (
    <div className="flex gap-5">
      <div className="flex gap-5">
        <MyButton color="secondary" variant="solid">
          Solid
        </MyButton>
        <MyButton color="secondary" variant="faded">
          Faded
        </MyButton>
        <MyButton color="secondary" variant="outline">
          Outline
        </MyButton>
        <MyButton color="secondary" variant="light">
          Light
        </MyButton>
        <MyButton color="secondary" variant="flat">
          Flat
        </MyButton>
        <MyButton color="secondary" variant="ghost">
          Ghost
        </MyButton>
        <MyButton color="secondary" variant="shadow">
          Shadow
        </MyButton>
      </div>

      <MyButton
        onClick={() => {
          setIsOpen(true);
        }}
        color="primary"
        variant="solid"
      >
        open modal
      </MyButton>
      {isOpen && (
        <ModalContainer height="80%" onClose={() => setIsOpen(false)}>
          <div className="overflow-hidden h-full w-fit dark:text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
            in sequi soluta accusamus numquam quidem veritatis laboriosam
            maiores exercitationem, eaque, illum voluptas, illo ad! Modi
            voluptatem accusantium ab aut obcaecati. Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Quidem similique eius nihil earum
            exercitationem minima, sapiente iste accusantium reiciendis
            veritatis impedit velit, expedita molestiae ea labore voluptatem
            nulla cumque soluta.
          </div>
        </ModalContainer>
      )}
      <Tabs tabs={tabs}></Tabs>
    </div>
  );
}

export default Test;
