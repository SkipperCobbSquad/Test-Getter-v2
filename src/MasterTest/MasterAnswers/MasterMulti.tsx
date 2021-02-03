import { AnswerInterface, UserAnswer } from '../../helpers/testInterfaces';
export interface Multi {
  guestionId: number;
  answers: Array<AnswerInterface>;
  UserAnswers: Array<UserAnswer>;
}

export interface CollectingAnswers {
  answer: AnswerInterface;
  users: Array<String>;
}

function MasterMulti(props: Multi) {
  const Collection: Array<CollectingAnswers> = [];
  for (const answer of props.answers) {
    const users: Array<string> = [];
    props.UserAnswers.forEach((UA) => {
      //I know this is bad but now this is only option <=> a refers to string | AnswerInterface so ts don not let me use a.id
      if (UA.answer.find((a: any) => a.id === answer.id)) {
        users.push(UA.username);
      }
    });
    Collection.push({ answer, users });
  }
  console.log(Collection);

  return (
    <div>
      {Collection.map((a) => (
        <p key={a.answer.id}>
          {a.answer.description} {a.users.length}
        </p>
      ))}
    </div>
  );
}
export default MasterMulti;
