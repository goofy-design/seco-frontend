import { Calendar, Mail, User } from "lucide-react";

interface ResponseCardProps {
  name: string;
  email: string;
  registrationDate: string;
  answers: { question: string; answer: string }[];
}

const ResponseCard = ({
  name,
  email,
  registrationDate,
  answers
}: ResponseCardProps) => {
  return (
    <div className="hover:shadow-md transition-shadow duration-200 border border-border">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">{name}</h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{email}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {/* Registered: {new Date(registrationDate).toLocaleDateString()} */}
                Registered: {registrationDate}
              </span>
            </div>

            {Array.isArray(answers) && answers.length > 0 ? (
              answers.map((qa, idx) => {
                return (
                  <div className="text-sm" key={idx}>
                    <span className="font-medium text-foreground">
                      {qa?.question || "Unnamed Question"}:
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {qa?.answer || "No Answer"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground">No responses.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
