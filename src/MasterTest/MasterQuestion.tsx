import styled from 'styled-components';

const QuestDiv = styled.div`
  display: flex;
  flex-direction: column;
  background: #815ac0;
  padding: 5px;
  margin: 10px;
  border: 10px solid #6247aa;
  border-radius: 20px;
`;
const QuestTop = styled.div`
  flex: 1;
  flex-direction: column;
`;

const QuestPTop: any = styled.p`
  background: ${(props: any) => (props.type ? '#b298dc' : '#e0aaff')};
  padding: 5px;
  border-radius: 10px;
  margin: 7px 0px;
`;

function MasterQuestion(props: any) {
  const q: any = props.quest;
  return (
    <QuestDiv>
      <QuestTop>
        <QuestPTop>{q.question}</QuestPTop>
        <QuestPTop type>Question type: {q.type}</QuestPTop>
      </QuestTop>
    </QuestDiv>
  );
}
export default MasterQuestion;
